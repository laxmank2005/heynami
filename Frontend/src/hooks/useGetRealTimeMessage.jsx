import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, updateMessageStatus, markAllMessagesRead, updateMessage, updateMessageReactions } from "../redux/messageSlice";
import { updateUserList } from "../redux/userSlice";
import { 
  importPublicKey, 
  base64ToArrayBuffer, 
  deriveSharedSecret, 
  decryptMessage 
} from "../utils/crypto";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { selectedUser, otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    // Use refs so the async handler always has the latest values without stale closures
    const selectedUserRef = useRef(selectedUser);
    const otherUsersRef = useRef(otherUsers);
    selectedUserRef.current = selectedUser;
    otherUsersRef.current = otherUsers;

    useEffect(() => {
        const handleNewMessage = async (newMessage) => {
            // Normalize IDs to strings immediately — prevents ObjectId vs string issues
            const senderIdStr = newMessage.senderId?.toString();
            const receiverIdStr = newMessage.receiverId?.toString();

            // Check if the sender is the user currently open in chat
            const isCurrentlySelected = selectedUserRef.current?._id?.toString() === senderIdStr;
            
            // --- E2EE Decryption for real-time messages ---
            let decryptedText = newMessage.message;
            if (newMessage.isEncrypted) {
                try {
                    const authUser = JSON.parse(localStorage.getItem("authUser"));
                    // Find sender in otherUsers using string comparison
                    const sender = (otherUsersRef.current || []).find(
                        u => u._id?.toString() === senderIdStr
                    ) || newMessage.senderObj;
                    
                    if (sender?.publicKey && authUser?.privateKey) {
                        const theirPublicKey = await importPublicKey(sender.publicKey);
                        const myPrivateKeyBuffer = base64ToArrayBuffer(authUser.privateKey);
                        const myPrivateKey = await window.crypto.subtle.importKey(
                            "pkcs8",
                            myPrivateKeyBuffer,
                            { name: "ECDH", namedCurve: "P-256" },
                            true,
                            ["deriveKey", "deriveBits"]
                        );
                        
                        const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
                        decryptedText = await decryptMessage(newMessage.message, sharedSecret);
                    }
                } catch (e) {
                    console.error("Failed to decrypt real-time message:", e);
                }
            }

            const finalMessage = {
              ...newMessage,
              message: decryptedText,
              senderId: senderIdStr,
              receiverId: receiverIdStr,
            };

            // Add to message list only if this conversation is open
            if (isCurrentlySelected) {
                dispatch(addMessage(finalMessage));
                
                // Real-time Read Receipt: The user is looking at the chat right now, so mark this message as read!
                try {
                    const authUser = JSON.parse(localStorage.getItem("authUser"));
                    fetch(API_ENDPOINTS.MESSAGE.MARK_READ(senderIdStr), {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${authUser?.token}` }
                    });
                } catch (err) {
                    console.error("Failed to emit real-time read receipt");
                }
            }
            
            // Always update sidebar: bump to top, show last message, unread badge
            dispatch(updateUserList({
                userId: senderIdStr,
                isUnread: !isCurrentlySelected,
                lastMessage: decryptedText,
                lastMessageTime: newMessage.createdAt,
                userObj: newMessage.senderObj,
            }));
        };

        // Handle delivery/read status updates for sent messages
        const handleMessageStatusUpdate = ({ messageId, status }) => {
            dispatch(updateMessageStatus({ messageId, status }));
        };

        const handleMessagesRead = ({ byUserId }) => {
            dispatch(markAllMessagesRead({ fromUserId: byUserId }));
        };

        const handleMessageEdited = async (data) => {
            const { messageId, isEdited, isEncrypted, senderId } = data;
            let decryptedText = data.message;
            
            if (isEncrypted) {
                try {
                    const authUser = JSON.parse(localStorage.getItem("authUser"));
                    const sender = (otherUsersRef.current || []).find(
                        u => u._id?.toString() === senderId?.toString()
                    );
                    
                    if (sender?.publicKey && authUser?.privateKey) {
                        const theirPublicKey = await importPublicKey(sender.publicKey);
                        const myPrivateKeyBuffer = base64ToArrayBuffer(authUser.privateKey);
                        const myPrivateKey = await window.crypto.subtle.importKey(
                            "pkcs8",
                            myPrivateKeyBuffer,
                            { name: "ECDH", namedCurve: "P-256" },
                            true,
                            ["deriveKey", "deriveBits"]
                        );
                        
                        const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
                        decryptedText = await decryptMessage(data.message, sharedSecret);
                    }
                } catch (e) {
                    console.error("Failed to decrypt edited message:", e);
                }
            }
            
            dispatch(updateMessage({ messageId, message: decryptedText, isEdited }));
        };

        const handleMessageDeleted = ({ messageId }) => {
            dispatch(updateMessage({ messageId, isDeleted: true, message: "" }));
        };

        const handleMessageReactionUpdated = ({ messageId, reactions }) => {
            dispatch(updateMessageReactions({ messageId, reactions }));
        };

        socket?.on("newMessage", handleNewMessage);
        socket?.on("messageStatusUpdate", handleMessageStatusUpdate);
        socket?.on("messagesRead", handleMessagesRead);
        socket?.on("messageEdited", handleMessageEdited);
        socket?.on("messageDeleted", handleMessageDeleted);
        socket?.on("messageReactionUpdated", handleMessageReactionUpdated);

        return () => {
            socket?.off("newMessage", handleNewMessage);
            socket?.off("messageStatusUpdate", handleMessageStatusUpdate);
            socket?.off("messagesRead", handleMessagesRead);
            socket?.off("messageEdited", handleMessageEdited);
            socket?.off("messageDeleted", handleMessageDeleted);
            socket?.off("messageReactionUpdated", handleMessageReactionUpdated);
        };
    }, [socket, dispatch]); // Only re-register when socket changes — refs handle the rest
};

export default useGetRealTimeMessage;