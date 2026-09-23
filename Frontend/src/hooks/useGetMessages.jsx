import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { API_ENDPOINTS } from "../config/api";
import { 
  importPublicKey, 
  base64ToArrayBuffer, 
  deriveSharedSecret, 
  decryptMessage 
} from "../utils/crypto";

const useGetMessages = async () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          API_ENDPOINTS.MESSAGE.GET(selectedUser?._id), {
            headers: {
              "Authorization": `Bearer ${authUser?.token}`
            }
          }
        );
        
        let messages = res.data;
        
        // --- E2EE Decryption ---
        if (messages.length > 0 && selectedUser?.publicKey && authUser?.privateKey) {
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
            
            // Decrypt all messages concurrently
            messages = await Promise.all(
              messages.map(async (msg) => {
                // To avoid breaking old plaintext messages in DB, we check if it looks like base64 ciphertext
                if (msg.isEncrypted) {
                  try {
                    const decryptedText = await decryptMessage(msg.message, sharedSecret);
                    return { ...msg, message: decryptedText };
                  } catch (e) {
                    return msg; // fallback to plaintext if decryption fails
                  }
                }
                return msg;
              })
            );
          } catch (cryptoErr) {
            console.error("Failed to decrypt message history:", cryptoErr);
          }
        }

        dispatch(setMessages(messages));
      } catch (error) {
        // Error fetching messages
      }
    };
    fetchMessages();
  },[selectedUser, dispatch]);
};

export default useGetMessages;
