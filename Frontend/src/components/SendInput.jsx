import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setMessages } from "../redux/messageSlice";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser, authUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const messageText = message;
    setMessage(""); // Clear input immediately
    
    // Optimistic update - show message instantly
    const tempMessage = {
      _id: Date.now().toString(), // Temporary ID
      message: messageText,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
    };
    
    // Add to UI immediately
    dispatch(setMessages([...(messages || []), tempMessage]));
    
    try {
      const res = await axios.post(
        API_ENDPOINTS.MESSAGE.SEND(selectedUser?._id),
        { message: messageText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authUser?.token}`
          },
          withCredentials: true
        }
      );
      
      // Replace temp message with real one from server
      const updatedMessages = [...(messages || []), res.data.newMessage];
      dispatch(setMessages(updatedMessages));
    } catch (error) {
      // Remove temp message on error
      dispatch(setMessages(messages || []));
      toast.error("Failed to send message");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoMdSend className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SendInput;