import React from 'react';
import { motion } from 'framer-motion';

const MessageBox = ({ isMyMessage, Message, Address, timestamp }) => {
  const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

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
            ? "bg-black text-white"
            : "bg-[#F5F5F7] text-black"
        }`}
      >
        <pre className="font-['SF Pro Display'] whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {Message}
        </pre>
        
        <div className="flex items-center justify-end space-x-2 mt-1">
          <span className={`text-[11px] ${
            isMyMessage ? "text-white/70" : "text-black/50"
          } font-['SF Pro Display']`}>
            {timestamp ? formatTime(timestamp) : formatTime(Math.floor(Date.now() / 1000))}
          </span>
          {isMyMessage && (
            <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBox;