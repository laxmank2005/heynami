import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ search }) => {
  useGetOtherUsers();
  const { otherUsers, authUser } = useSelector((state) => state.user);

  if (!otherUsers) return null;

  // Safety: never show yourself in the list
  const nonSelfUsers = otherUsers.filter(u => u._id !== authUser?._id);

  const filteredUsers = search
    ? nonSelfUsers.filter((user) =>
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile?.includes(search)
      )
    : nonSelfUsers;

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
      ) : null}
    </div>
  );
};

export default OtherUsers;
