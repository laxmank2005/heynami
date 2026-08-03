import React from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";

const MessageContainer = () => {
  const { selectedUser  } = useSelector((state) => state.user);

  
  return (

    <div className="md:min-w-[550px] flex flex-col ">
      <div className=" flex items-center gap-2 p-1 cursor-pointer mb-2 px-4 py-2  bg-gray-300 ">
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img src={selectedUser?.profilePhoto} alt={selectedUser?.fullName} />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center  gap-2">
           <p>{selectedUser?.fullName}</p>
          </div>
        </div>
      </div>
      <Messages />

      <SendInput />
    </div>
  );
};

export default MessageContainer;
