import React from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";

const Messages = () => {
  useGetMessages();
  const { messages } = useSelector((store) => store.message);

  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div
      className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 bg-white dark:bg-[#0d0d0d] transition-colors duration-300"
    >
      {messages && messages.length > 0 ? (
        messages.map((message, index) => {
          const currentDate = new Date(message.createdAt).toDateString();
          const previousDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;
          const showDivider = currentDate !== previousDate;

          return (
            <React.Fragment key={message._id}>
              {showDivider && (
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-gray-100 dark:bg-stone-800" />
                  <span
                    className="text-[11px] font-semibold text-gray-400 dark:text-stone-500 whitespace-nowrap"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {formatDateLabel(message.createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-stone-800" />
                </div>
              )}
              <Message message={message} />
            </React.Fragment>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-gray-300 dark:text-stone-600"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            No messages yet — say hello! 👋
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;