import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";

const MessageContainer = () => {
  const { selectedUser,authUser,onlineUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const isOnline = onlineUsers?.includes(selectedUser?._id) || false;

  return (
    <>
    {
      selectedUser !== null ? (
        <div className="flex-1 flex flex-col bg-white h-full">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => dispatch(setSelectedUser(null))}
                className="sm:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <IoArrowBack className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <img 
                  src={selectedUser?.profilePhoto} 
                  alt={selectedUser?.fullName}
                  className="w-10 h-10 rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              
              <div>
                <h3 className="text-gray-900 font-semibold">{selectedUser?.fullName}</h3>
                <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition">
              <BsThreeDotsVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <Messages />

          {/* Send Input */}
          <SendInput />
        </div>
      ): (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {authUser?.fullName}!
            </h1>
            <p className="text-gray-600 mb-4">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      )
    }
    </>
  );
};

export default MessageContainer;
