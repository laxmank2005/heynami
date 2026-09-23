import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";

import { updateUserList } from "../redux/userSlice";
import { 
  importPublicKey, 
  base64ToArrayBuffer, 
  deriveSharedSecret, 
  decryptMessage 
} from "../utils/crypto";

const useGetRealTimeMessage =()=>{
    const {socket} =useSelector(store=>store.socket);
    const {selectedUser, otherUsers} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    useEffect(()=>{
        const handleNewMessage = async (newMessage)=>{
            const isCurrentlySelected = selectedUser?._id === newMessage.senderId;
            
            // --- E2EE Decryption for real-time messages ---
            let decryptedText = newMessage.message;
            if (newMessage.isEncrypted) {
                try {
                    const authUser = JSON.parse(localStorage.getItem("authUser"));
                    // Find the sender in the users list to get their public key
                    const sender = otherUsers.find(u => u._id === newMessage.senderId);
                    
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

            const finalMessage = { ...newMessage, message: decryptedText };

            if (isCurrentlySelected) {
                dispatch(addMessage(finalMessage))
            }
            
            dispatch(updateUserList({
                userId: newMessage.senderId,
                isUnread: !isCurrentlySelected
            }));
        };

        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    },[socket, selectedUser, dispatch]);
}

export default useGetRealTimeMessage;