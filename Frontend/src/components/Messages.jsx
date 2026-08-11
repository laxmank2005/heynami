import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useSelector } from 'react-redux';

const Messages = () => {
  useGetRealTimeMessage();
  useGetMessages();
  const { messages } = useSelector((store) => store.message);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-white">
      {
       messages && messages?.map((message, index) => {
          const currentDate = new Date(message.createdAt).toDateString();
          const previousDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDateDivider = currentDate !== previousDate;

          return (
            <React.Fragment key={message._id}>
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-100/80 text-gray-500 font-medium text-[11px] px-3 py-1 rounded-full border border-gray-200/50 shadow-sm uppercase tracking-wide">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              )}
              <Message message={message} />
            </React.Fragment>
          )
        })
      }
    </div>
  );
};

export default Messages;