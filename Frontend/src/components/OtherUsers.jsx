import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = () => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((state) => state.user);

  if (!otherUsers) return;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
      {otherUsers.map((user) => (
        <OtherUser key={user._id} user={user} />
        
      ))}
    </div>
  );
};

export default OtherUsers;
