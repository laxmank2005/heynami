import React from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";

const MessageContainer = () => {
  return (
    <div className="md:min-w-[550px] flex flex-col ">
      <div className=" flex items-center gap-2 p-1 cursor-pointer mb-2 px-4 py-2  bg-gray-300 ">
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img
              src="https://wallpapersok.com/images/thumbnail/cool-neon-blue-profile-picture-u9y9ydo971k9mdcf.webp"
              alt="user-profile"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center  gap-2">
            <p>Bro Code</p>
          </div>
        </div>
      </div>
      <Messages />
      
      <SendInput/>
    </div>
  );
};

export default MessageContainer;
