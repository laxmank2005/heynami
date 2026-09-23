import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ search }) => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((state) => state.user);

  if (!otherUsers) return null;

  const filteredUsers = search
    ? otherUsers.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile?.includes(search)
      )
    : otherUsers;

  return (
    <div className="flex flex-col">
      {filteredUsers.length > 0 ? (
        <>
          <p className="px-5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-stone-500"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            All Messages
          </p>
          {filteredUsers.map((user) => (
            <OtherUser key={user._id} user={user} />
          ))}
        </>
      ) : (
        <div className="text-center py-8 text-sm text-gray-400 dark:text-stone-500">
          No conversations found
        </div>
      )}
    </div>
  );
};

export default OtherUsers;
