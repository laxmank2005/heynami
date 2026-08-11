import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ search }) => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((state) => state.user);

  if (!otherUsers) return null;

  const filteredUsers = search
    ? otherUsers.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()))
    : otherUsers;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <OtherUser key={user._id} user={user} />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-4 text-sm">No users found</div>
      )}
    </div>
  );
};

export default OtherUsers;
