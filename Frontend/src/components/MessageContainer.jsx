import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";



const MessageContainer = () => {
  const { selectedUser,authUser,onlineUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const isOnline = onlineUsers?.includes(selectedUser?._id) || false;

  


  
  return (

    <>
    {
      selectedUser !== null ? (
        <div className="md:min-w-[550px] flex flex-col ">
      <div className=" flex items-center gap-2 p-1 cursor-pointer mb-2 px-4 py-2  bg-gray-300 ">
        <div className={`avatar  ${isOnline ? 'avatar-online' :'' }`}>
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
      ): (
        <div className="md:min-w-[550px] flex flex-col justify-center item-center">
          <h1 className="flex  justify-center item-center text-2xl font-bold ">Welcome back ! {authUser?.fullName} </h1>
          <h1 className="flex  justify-center item-center ">Lets Start Coversation </h1>
          </div>
        
      )
    }
    </>

    
  );
};

export default MessageContainer;
