import React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser } = useSelector(store => store.user);
  const isMyMessage = authUser?._id === message?.senderId;
  
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={scroll} className={`flex mb-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`rounded-lg px-3 py-2 max-w-[70%] shadow-sm ${
          isMyMessage 
            ? 'bg-[#6087D0] text-white' 
            : 'bg-gray-200 text-black'
        }`}
      >
        <p className="text-sm break-words">{message?.message}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-[10px] ${isMyMessage ? 'text-gray-100' : 'text-gray-500'}`}>
            {new Date(message?.createdAt).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
