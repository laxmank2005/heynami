import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { API_ENDPOINTS } from "../config/api";
import { 
  importPublicKey, 
  deriveSharedSecret, 
  decryptMessage 
} from "../utils/crypto";
import { getPrivateKey } from "../utils/keyStore";

// NOTE: Hook must NOT be async - async work happens inside useEffect
const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          API_ENDPOINTS.MESSAGE.GET(selectedUser._id), {
            headers: {
              "Authorization": `Bearer ${authUser?.token}`
            }
          }
        );
        
        let messages = res.data;
        
        // --- E2EE Decryption ---
        // Load private key securely from IndexedDB (never from localStorage)
        const myPrivateKey = authUser?._id ? await getPrivateKey(authUser._id.toString()) : null;

        if (messages.length > 0 && selectedUser?.publicKey && myPrivateKey) {
          try {
            const theirPublicKey = await importPublicKey(selectedUser.publicKey);
            const sharedSecret = await deriveSharedSecret(myPrivateKey, theirPublicKey);
            
            // Decrypt all messages concurrently
            messages = await Promise.all(
              messages.map(async (msg) => {
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

        // Normalize all senderId/receiverId to strings (prevents ObjectId vs string comparison bugs)
        messages = messages.map(msg => ({
          ...msg,
          senderId: msg.senderId?.toString?.() ?? msg.senderId,
          receiverId: msg.receiverId?.toString?.() ?? msg.receiverId,
        }));

        dispatch(setMessages(messages));
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessages([]));
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]);
};

export default useGetMessages;
