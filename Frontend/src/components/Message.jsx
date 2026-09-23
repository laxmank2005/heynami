import React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector(store => store.user);
  const isMyMessage = authUser?._id === message?.senderId;

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const timeStr = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div
      ref={scroll}
      className={`flex items-end gap-2.5 mb-4 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Other user's avatar */}
      {!isMyMessage && (
        <div className="flex-shrink-0 mb-1">
          {selectedUser?.profilePhoto ? (
            <img
              src={selectedUser.profilePhoto}
              alt={selectedUser?.fullName}
              className="w-8 h-8 rounded-full object-cover"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.10)" }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {(selectedUser?.fullName || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Bubble group */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${isMyMessage ? "items-end" : "items-start"}`}
      >
        {/* Sender label + time */}
        {!isMyMessage && (
          <div className="flex items-center gap-2 px-1">
            <span
              className="text-xs font-semibold text-gray-700 dark:text-stone-300"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {selectedUser?.fullName?.split(" ")[0]}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-stone-500">{timeStr}</span>
          </div>
        )}
        {isMyMessage && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] text-gray-400 dark:text-stone-500">{timeStr}</span>
            <span
              className="text-xs font-semibold text-gray-700 dark:text-stone-300"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              You
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm break-words leading-relaxed ${
            isMyMessage
              ? "text-white rounded-2xl rounded-br-sm"
              : "text-gray-800 dark:text-stone-100 bg-gray-50 dark:bg-stone-800/80 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-stone-700"
          }`}
          style={
            isMyMessage
              ? {
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                  boxShadow: "0 4px 14px rgba(109,40,217,0.25)",
                  fontFamily: "Inter, system-ui, sans-serif",
                }
              : {
                  fontFamily: "Inter, system-ui, sans-serif",
                }
          }
        >
          {message?.message}
        </div>
      </div>
    </div>
  );
};

export default Message;
