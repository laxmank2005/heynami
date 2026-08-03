import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';

const Messages = () => {
  useGetMessages();
  const { messages } = useSelector((store) => store.message);

  if (!messages) return;

  return (
    <div className="flex-1 gap-2 p-4 overflow-auto custom-scrollbar">
      {messages?.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

export default Messages;