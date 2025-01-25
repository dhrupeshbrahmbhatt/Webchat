import React from 'react';
import { motion } from 'framer-motion';

const MessageBox = ({ isMyMessage, Message, Address, timestamp }) => {
  const formatTime = (unixTimestamp) => {
    // Convert Unix timestamp to milliseconds
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Add message content handling
  const messageContent = typeof Message === 'object' ? 
    Message?.body || JSON.stringify(Message) : 
    Message?.toString() || '';

  return (
    <motion.div
      className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-3`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative px-4 py-3 max-w-[65%] rounded-xl ${
          isMyMessage
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            : "bg-white/5 backdrop-blur-sm text-gray-200"
        } border border-white/10`}
      >
        <pre className="font-['Graphik'] whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {messageContent}
        </pre>
        
        <div className="flex items-center justify-end space-x-2 mt-1">
          <span className="text-[11px] opacity-70 font-['Graphik']">
            {timestamp ? formatTime(timestamp) : formatTime(Math.floor(Date.now() / 1000))}
          </span>
          {isMyMessage && (
            <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBox;