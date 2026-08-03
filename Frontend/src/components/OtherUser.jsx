import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const {selectedUser}=useSelector(store=>store.user)

  const selectedUserHandler = () => {
    dispatch(setSelectedUser(user));
  };

  return (
  <div
    onClick={selectedUserHandler}
    className={`flex items-center gap-2 p-1 cursor-pointer transition-all duration-100 rounded-3xl
      ${
        selectedUser?._id === user?._id
          ? "bg-[#6087D0] text-white"
          : "hover:bg-[#94999a22] text-black"
      }`}
  >
    <div className="avatar avatar-online">
      <div className="w-12 rounded-full">
        <img src={user.profilePhoto} alt={user.fullName} />
      </div>
    </div>

    <div className="flex flex-col flex-1">
      <p>{user.fullName}</p>
    </div>
  </div>
);
};

export default OtherUser;
