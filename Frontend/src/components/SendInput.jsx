import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, addMessage, setReplyingTo, setEditingMessage, updateMessage } from "../redux/messageSlice";
import { updateUserList } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";
import { 
  importPublicKey, 
  deriveSharedSecret, 
  encryptMessage 
} from "../utils/crypto";
import { getPrivateKey } from "../utils/keyStore";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsX } from "react-icons/bs";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const inputRef = useRef();
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  
  const { selectedUser, authUser } = useSelector(store => store.user);
  const { messages: messagesFromStore, replyingTo, editingMessage } = useSelector(store => store.message);
  
  const messagesRef = useRef(messagesFromStore);
  messagesRef.current = messagesFromStore; // always up-to-date in async callbacks
  
  const { socket } = useSelector(store => store.socket);

  // When editing, populate input
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.message);
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const cancelAction = () => {
    if (editingMessage) {
        dispatch(setEditingMessage(null));
        setMessage("");
    }
    if (replyingTo) {
        dispatch(setReplyingTo(null));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    if (selectedUser?._id === authUser?._id) {
      toast.error("You cannot send a message to yourself.");
      return;
    }

    setMessage("");
    setIsSending(true);

    if (editingMessage) {
        // Edit mode
        try {
            let messageToSend = text;
            let isMessageEncrypted = false;
            if (selectedUser?.publicKey) {
                const myPrivateKey = authUser?._id ? await getPrivateKey(authUser._id.toString()) : null;
                if (myPrivateKey) {
                    const theirPublicKey = await importPublicKey(selectedUser.publicKey);
                    const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
                    messageToSend = await encryptMessage(text, sharedSecret);
                    isMessageEncrypted = true;
                }
            }

            axios.defaults.withCredentials = true;
            await axios.put(
                API_ENDPOINTS.MESSAGE.EDIT(editingMessage._id),
                { message: messageToSend, isEncrypted: isMessageEncrypted },
                { headers: { Authorization: `Bearer ${authUser?.token}` } }
            );

            // Optimistic update locally
            dispatch(updateMessage({ messageId: editingMessage._id, message: text, isEdited: true }));
            dispatch(setEditingMessage(null));
        } catch (err) {
            toast.error("Failed to edit message");
            setMessage(text); // restore
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
        return;
    }

    // Send/Reply mode
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: text,
      senderId: authUser._id?.toString(),
      receiverId: selectedUser._id?.toString(),
      createdAt: new Date().toISOString(),
      replyTo: replyingTo?._id || null,
    };
    dispatch(setMessages([...(messagesRef.current || []), tempMessage]));
    
    const currentReplyToId = replyingTo?._id;
    dispatch(setReplyingTo(null));

    try {
      let messageToSend = text;
      let isMessageEncrypted = false;

      if (selectedUser?.publicKey) {
        try {
          const myPrivateKey = authUser?._id ? await getPrivateKey(authUser._id.toString()) : null;
          if (myPrivateKey) {
            const theirPublicKey = await importPublicKey(selectedUser.publicKey);
            const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
            messageToSend = await encryptMessage(text, sharedSecret);
            isMessageEncrypted = true;
          }
        } catch (cryptoErr) {
          console.error("Encryption failed:", cryptoErr);
          toast.error("Encryption failed. Message not sent.");
          dispatch(setMessages(messagesRef.current.filter(m => m._id !== tempMessage._id) || []));
          setIsSending(false);
          return;
        }
      }

      const res = await axios.post(
        API_ENDPOINTS.MESSAGE.SEND(selectedUser?._id),
        { message: messageToSend, isEncrypted: isMessageEncrypted, replyTo: currentReplyToId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser?.token}`,
          },
          withCredentials: true,
        }
      );
      
      const realMessage = res.data.newMessage;
      realMessage.message = text;
      realMessage.senderId = realMessage.senderId?.toString?.() ?? realMessage.senderId;

      const currentMsgs = messagesRef.current || [];
      dispatch(setMessages(currentMsgs.filter(m => m._id !== tempMessage._id).concat(realMessage)));

      dispatch(updateUserList({
        userId: selectedUser._id,
        isUnread: false,
        lastMessage: text,
        lastMessageTime: realMessage.createdAt || new Date().toISOString(),
        userObj: selectedUser,
      }));
    } catch {
      dispatch(setMessages(messagesRef.current.filter(m => m._id !== tempMessage._id) || []));
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmitHandler(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!socket || !selectedUser) return;

    socket.emit("typing", { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-[calc(100%+10px)] left-4 z-50 shadow-2xl">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="px-4 sm:px-5 py-4 pb-6 sm:pb-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-stone-800 transition-colors flex flex-col"
      >
        {/* Banner for Replying / Editing */}
        {(replyingTo || editingMessage) && (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-stone-800 p-2 px-3 rounded-t-xl mb-1 text-sm border-l-4 border-violet-500">
                <div className="flex flex-col overflow-hidden max-w-[90%]">
                    <span className="font-semibold text-violet-600 dark:text-violet-400 text-xs uppercase tracking-wider mb-0.5">
                        {editingMessage ? "Editing Message" : `Replying to ${replyingTo.senderId.toString() === authUser?._id?.toString() ? "yourself" : selectedUser?.fullName}`}
                    </span>
                    <span className="truncate text-gray-600 dark:text-stone-400">
                        {editingMessage ? editingMessage.message : replyingTo.message}
                    </span>
                </div>
                <button type="button" onClick={cancelAction} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 transition">
                    <BsX className="text-xl" />
                </button>
            </div>
        )}

        <div
          className={`flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 dark:focus-within:ring-violet-900/30 transition-all ${
              (replyingTo || editingMessage) ? "rounded-b-xl rounded-t-none" : "rounded-2xl"
          }`}
        >
          {/* Emoji toggle icon */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex-shrink-0 text-gray-400 dark:text-stone-500 hover:text-violet-500 transition-colors"
          >
            <BsEmojiSmile className="text-xl" />
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={`Chat with ${selectedUser?.fullName?.split(" ")[0] || "..."}` }
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            autoComplete="off"
          />

          {/* Send/Save button */}
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="flex-shrink-0 p-2 rounded-xl transition-all disabled:opacity-30"
            style={{ color: message.trim() ? "#7C3AED" : "#9ca3af" }}
          >
            {editingMessage ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendInput;