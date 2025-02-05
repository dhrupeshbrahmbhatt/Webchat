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

  const textVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full z-40
          ${isSidebarExpanded ? 'w-64' : 'w-[72px]'}
          flex flex-col
          bg-black/10 backdrop-blur-sm border-r border-white/10
          from-slate-900 to-slate-800
        `}
      >
        {/* Navigation Icons */}
        <div className="flex-1 w-full flex flex-col items-center pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={item.onClick}
                className={`
                  w-full h-12 flex items-center justify-start px-6
                  ${activeTab === item.path 
                    ? 'text-purple-500 bg-white/5' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-purple-400'}
                `}
              >
                <Icon className="w-6 h-6" />
                {isSidebarExpanded && (
                  <span className="ml-4 text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="w-full">
          <button
            onClick={() => handleTabChange('settings')}
            className="w-full h-12 flex items-center justify-start px-6
              text-gray-400 hover:bg-white/5 hover:text-purple-400"
          >
            <IoSettingsOutline className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-medium">Settings</span>
            )}
          </button>
        </div>

        {/* Profile Section */}
        <div className="w-full pb-4">
          <button
            className="w-full h-12 flex items-center justify-start px-6
              text-gray-400 hover:bg-white/5 hover:text-purple-400"
          >
            <RxAvatar className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-medium">Profile</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content - with animations */}
      <motion.div 
        initial="initial"
        animate="animate"
        className={`
          flex-1 
          ${isSidebarExpanded ? 'ml-64' : 'ml-[72px]'}
          bg-slate-900/95 backdrop-blur-sm
        `}
      >
        <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-900/50 to-slate-800/50">
          <div className="text-center">
            <motion.h2 
              variants={contentVariants}
              className="text-6xl font-['Freight_Disp_Pro'] text-gray-400 mb-2 
                bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
            >
              Calls Feature
            </motion.h2>
            <motion.p 
              variants={textVariants}
              className="text-gray-500 text-2xl hover:text-purple-400"
            >
              Coming soon...
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
              }}
              className="mt-8"
            >
              <svg 
                className="w-24 h-24 mx-auto text-purple-400/50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2c0-4.9-4-8.9-9-8.9v2c3.9 0 7 3.1 7 6.9zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 