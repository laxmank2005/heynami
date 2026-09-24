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
      {/* Loading skeleton */}
      {messages === null && (
        <div className="flex flex-col gap-6 pt-4">
          {[...Array(6)].map((_, i) => {
            const isMyMessage = i % 2 !== 0;
            const bubbleWidths = ['w-32', 'w-48', 'w-64', 'w-40', 'w-56', 'w-36'];
            
            return (
              <div key={i} className={`flex items-start gap-2.5 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                {!isMyMessage && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-stone-800 animate-pulse flex-shrink-0 mt-0.5" />
                )}
                
                <div className={`flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Time Skeleton */}
                  <div className="flex items-center gap-2 px-1 mb-0.5">
                    <div className="h-3 w-12 bg-gray-200 dark:bg-stone-800 rounded animate-pulse" />
                    <div className="h-2.5 w-10 bg-gray-100 dark:bg-stone-800/60 rounded animate-pulse" />
                  </div>
                  
                  {/* Chat Bubble Skeleton */}
                  <div className={`h-10 rounded-2xl animate-pulse ${
                    isMyMessage 
                      ? 'bg-violet-100 dark:bg-violet-900/20 rounded-br-sm' 
                      : 'bg-gray-100 dark:bg-stone-800 rounded-bl-sm'
                  } ${bubbleWidths[i]}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Messages list */}
      {messages !== null && messages.length > 0 ? (
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
      ) : messages !== null ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-gray-300 dark:text-stone-600"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            No messages yet — say hello! 👋
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Messages;