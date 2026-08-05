import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${selectedUser?._id}`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      dispatch(setMessages([...(messages || []), res.data.newMessage]));
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className=" px-4 my-3">
      <div className="relative w-full">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder=" Type a message..."
          className="block w-full rounded-2xl border border-gray-400 p-2 pr-12 text-sm text-black"
        />

        <button
          type="submit"
          aria-label="Send message"
          className="cursor-pointer absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-2xl text-[#6087D0] transition hover:scale-110 hover:text-[#3e65ae]   active:scale-95"
        >
          <IoMdSend className="" />
        </button>
      </div>
    </form>
  );
};

export default SendInput;