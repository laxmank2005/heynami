import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const {selectedUser,onlineUsers}=useSelector(store=>store.user);
  const isOnline=onlineUsers?.includes(user._id);

  const selectedUserHandler = () => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div
      onClick={selectedUserHandler}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100
        ${
          selectedUser?._id === user?._id
            ? "bg-blue-50 border-l-4 border-l-blue-500"
            : "hover:bg-gray-50"
        }`}
    >
      <div className="relative">
        <img 
          src={user.profilePhoto} 
          alt={user.fullName}
          className="w-12 h-12 rounded-full"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-medium truncate text-gray-900">{user.fullName}</p>
        <p className="text-xs text-gray-500">
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default OtherUser;
