import React from "react";

const OtherUser = () => {
  return (
    <div>
      <div className=" flex items-center gap-2 p-1 cursor-pointer hover:bg-[#bcc4c64d] transition-all duration-100 rounded-3xl">
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
        <div className="divider px-3 "></div>
      </div>
    </div>
  );
};

export default OtherUser;
