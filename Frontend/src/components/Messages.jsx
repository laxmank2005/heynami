import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useSelector } from 'react-redux';

const Messages = () => {
  useGetRealTimeMessage();
  useGetMessages();
  const { messages } = useSelector((store) => store.message);

  // if (!messages) return;

  return (
    <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-gray-100">
      {
       messages && messages?.map((message) => {
          return (
            <Message key={message._id} message={message} />
          )
        })
      }
    </div>
  );
};

export default Messages;