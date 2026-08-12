import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, clearUnread } from "../redux/userSlice";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const {selectedUser,onlineUsers}=useSelector(store=>store.user);
  const isOnline=onlineUsers?.includes(user._id);

  const selectedUserHandler = () => {
    dispatch(setSelectedUser(user));
    dispatch(clearUnread(user._id));
  };

  return (
    <div
      onClick={selectedUserHandler}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-stone-800
        ${
          selectedUser?._id === user?._id
            ? "bg-blue-50 dark:bg-indigo-900/30 border-l-4 border-l-blue-500 dark:border-l-indigo-500"
            : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
        }`}
    >
      <div className="relative">
        <img 
          src={user.profilePhoto} 
          alt={user.fullName}
          className="w-12 h-12 rounded-full border border-transparent dark:border-stone-700"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full"></span>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className={`font-medium truncate transition-colors ${user.hasUnread ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-900 dark:text-stone-300'}`}>{user.fullName}</p>
          {user.hasUnread && (
            <div className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse ml-2 flex-shrink-0 shadow-sm" title="New message"></div>
          )}
        </div>
        <p className={`text-xs font-medium transition-colors ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-stone-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default OtherUser;
