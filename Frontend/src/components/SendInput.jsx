import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { updateUserList } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";
import { 
  importPublicKey, 
  base64ToArrayBuffer, 
  deriveSharedSecret, 
  encryptMessage 
} from "../utils/crypto";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef();
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedUser, authUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);
  const { socket } = useSelector(store => store.socket);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    setMessage("");
    setIsSending(true);

    // Optimistic add (we show the plaintext locally temporarily)
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: text, // Keep plaintext for optimistic UI
      senderId: authUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
    };
    dispatch(setMessages([...(messages || []), tempMessage]));

    try {
      let messageToSend = text;
      let isMessageEncrypted = false;

      // Encrypt the message if we have both keys
      if (selectedUser?.publicKey && authUser?.privateKey) {
        try {
          const theirPublicKey = await importPublicKey(selectedUser.publicKey);
          const myPrivateKeyBuffer = base64ToArrayBuffer(authUser.privateKey);
          const myPrivateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            myPrivateKeyBuffer,
            { name: "ECDH", namedCurve: "P-256" },
            true,
            ["deriveKey", "deriveBits"]
          );
          
          const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
          messageToSend = await encryptMessage(text, sharedSecret);
          isMessageEncrypted = true;
        } catch (cryptoErr) {
          console.error("Encryption failed:", cryptoErr);
          toast.error("Encryption failed. Message not sent.");
          dispatch(setMessages(messages || []));
          setIsSending(false);
          return;
        }
      }

      const res = await axios.post(
        API_ENDPOINTS.MESSAGE.SEND(selectedUser?._id),
        { message: messageToSend, isEncrypted: isMessageEncrypted },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser?.token}`,
          },
          withCredentials: true,
        }
      );
      // Replace temp with real (and override encrypted server message with our local plaintext for UX)
      const updated = (messages || []).filter(m => m._id !== tempMessage._id);
      
      const realMessage = res.data.newMessage;
      // Force plaintext on our end since we just sent it
      realMessage.message = text; 

      dispatch(setMessages([...updated, realMessage]));
      // Update sidebar last message preview
      dispatch(updateUserList({
        userId: selectedUser._id,
        isUnread: false,
        lastMessage: text,
        lastMessageTime: realMessage.createdAt || new Date().toISOString(),
      }));
    } catch {
      dispatch(setMessages(messages || []));
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

  // Emit typing indicator to the selected user via socket
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!socket || !selectedUser) return;

    // Emit typing event
    socket.emit("typing", { receiverId: selectedUser._id });

    // Clear existing stop-typing timer and reset it
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 2000);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="px-4 sm:px-5 py-4 pb-6 sm:pb-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-stone-800 transition-colors"
    >
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 dark:focus-within:ring-violet-900/30 transition-all"
      >
        {/* Mic icon */}
        <button
          type="button"
          className="flex-shrink-0 text-gray-400 dark:text-stone-500 hover:text-violet-500 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
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

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="flex-shrink-0 p-2 rounded-xl transition-all disabled:opacity-30"
          style={{
            color: message.trim() ? "#7C3AED" : "#9ca3af",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SendInput;