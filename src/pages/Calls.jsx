import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BiMessageDetail } from 'react-icons/bi';
import { IoCallOutline, IoSettingsOutline } from 'react-icons/io5';
import { HiMenuAlt2 } from 'react-icons/hi';
import { RxAvatar } from 'react-icons/rx';
import { AiOutlineStar } from 'react-icons/ai';
import { BiArchive } from 'react-icons/bi';
import { motion } from 'framer-motion';

export const Calls = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calls');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      navigate('/');
    }
  };

  const menuItems = [
    { 
      path: 'menu',
      icon: HiMenuAlt2,
      label: 'Menu',
      onClick: () => setIsSidebarExpanded(!isSidebarExpanded)
    },
    { 
      path: 'chat', 
      icon: BiMessageDetail, 
      label: 'Chats',
      onClick: () => navigate('/dashboard')
    },
    { 
      path: 'calls', 
      icon: IoCallOutline, 
      label: 'Calls',
      onClick: () => handleTabChange('calls')
    },
    { 
      path: 'starred', 
      icon: AiOutlineStar, 
      label: 'Starred messages',
      onClick: () => handleTabChange('starred')
    },
    { 
      path: 'archived', 
      icon: BiArchive, 
      label: 'Archived',
      onClick: () => handleTabChange('archived')
    },
  ];

  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full z-40
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isSidebarExpanded ? 'w-72' : 'w-20'}
        flex flex-col
        bg-white border-r border-gray-100
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <span className="text-[#1a8cd8] text-xl font-semibold">
            {isSidebarExpanded ? 'WebChat' : 'W'}
          </span>
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 w-full flex flex-col items-center pt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={item.onClick}
                className={`
                  w-full h-14 flex items-center justify-start px-6
                  transition-all duration-300 group
                  ${activeTab === item.path 
                    ? 'text-[#1a8cd8] bg-[#1a8cd8]/5' 
                    : 'text-gray-500 hover:bg-[#1a8cd8]/5 hover:text-[#1a8cd8]'}
                `}
              >
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isSidebarExpanded ? '' : 'group-hover:scale-110'}`} />
                {isSidebarExpanded && (
                  <span className="ml-4 text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings & Profile Section */}
        <div className="w-full pb-8 space-y-2">
          <button
            className="w-full h-14 flex items-center justify-start px-6
              transition-all duration-300 text-gray-500 
              hover:bg-[#1a8cd8]/5 hover:text-[#1a8cd8]"
          >
            <IoSettingsOutline className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-medium">Settings</span>
            )}
          </button>
          <button
            className="w-full h-14 flex items-center justify-start px-6
              transition-all duration-300 text-gray-500 
              hover:bg-[#1a8cd8]/5 hover:text-[#1a8cd8]"
          >
            <RxAvatar className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-medium">Profile</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        flex-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isSidebarExpanded ? 'ml-72' : 'ml-20'}
      `}>
        <motion.div 
          initial="initial"
          animate="animate"
          variants={contentVariants}
          className="h-full flex flex-col items-center justify-center px-4"
        >
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01]
              }}
              className="mb-8"
            >
              <svg 
                className="w-24 h-24 mx-auto text-[#1a8cd8] opacity-20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2c0-4.9-4-8.9-9-8.9v2c3.9 0 7 3.1 7 6.9zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
              </svg>
            </motion.div>
            
            <motion.h1 
              variants={contentVariants}
              className="text-4xl font-semibold text-gray-900 mb-4"
            >
              Calls Feature Coming Soon
            </motion.h1>
            
            <motion.p 
              variants={contentVariants}
              className="text-lg text-gray-500 mb-8"
            >
              We're working on bringing you crystal-clear voice and video calls.
            </motion.p>

            <motion.button
              variants={contentVariants}
              className="bg-[#1a8cd8] text-white px-6 py-3 rounded-full
                hover:bg-[#1a8cd8]/90 transition-colors duration-200
                text-sm font-medium"
            >
              Get Notified
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 