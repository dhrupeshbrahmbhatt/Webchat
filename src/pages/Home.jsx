import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { MdOutlineChatBubbleOutline, MdOutlinePhone } from "react-icons/md";
import { Message } from '../Components/Message';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { BiMessageDetail } from 'react-icons/bi';
import { IoCallOutline, IoSettingsOutline } from 'react-icons/io5';
import { BsCameraVideo } from 'react-icons/bs';
import { HiMenuAlt2 } from 'react-icons/hi';
import { RxAvatar } from 'react-icons/rx';
import { AiOutlineStar } from 'react-icons/ai';
import { BiArchive } from 'react-icons/bi';
import { ProfileMenu } from '../Components/ProfileMenu';
import { motion } from 'framer-motion';

export const Home = () => {
  const token = document.cookie;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileMenuTab, setProfileMenuTab] = useState('profile');
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const check_Auth = async () => {
    try {
      const req = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
          'Content-Type': 'application/json',
        }
      });
      if (req.data === 'Access denied') {
        window.location.href = "/signin";
      }
    } catch (err) {
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    check_Auth();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'calls') {
      setTimeout(() => {
        navigate('/calls');
        document.body.style.opacity = '1';
      }, 300);
    }
  };

  const handleContactClick = (contact) => {
    setSelectedChat(contact.id);
    setSelectedContact(contact);
  };

  const handleClose = () => {
    setSelectedChat(null);
    setSelectedContact(null);
  };

  // Add this demo data
  const demoContacts = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "A",
      lastMessage: "Hey, how's the project going?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "B",
      lastMessage: "The meeting is scheduled for tomorrow",
      time: "9:15 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Carol White",
      avatar: "C",
      lastMessage: "Thanks for the update!",
      time: "Yesterday",
      unread: 1,
    },
    {
      id: 4,
      name: "David Brown",
      avatar: "D",
      lastMessage: "Let's discuss this later",
      time: "Yesterday",
      unread: 0,
    },
  ];

  // Add search handler with empty query handling
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredContacts(demoContacts); // Show all contacts when search is empty
    } else {
      const filtered = demoContacts.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.lastMessage.toLowerCase().includes(query)
      );
      setFilteredContacts(filtered);
    }
  };

  // Initialize filteredContacts with all contacts when component mounts
  useEffect(() => {
    setFilteredContacts(demoContacts);
  }, []);

  const menuItems = [
    { 
      path: 'menu',
      icon: HiMenuAlt2,
      label: 'Menu',
      onClick: (e) => {
        e.stopPropagation();
        setIsSidebarExpanded(!isSidebarExpanded);
      }
    },
    { 
      path: 'chat', 
      icon: BiMessageDetail, 
      label: 'Chats',
      onClick: (e) => {
        e.stopPropagation();
        navigate('/dashboard');
      }
    },
    { 
      path: 'calls', 
      icon: IoCallOutline, 
      label: 'Calls',
      onClick: (e) => {
        e.stopPropagation();
        handleTabChange('calls');
      }
    },
    { 
      path: 'starred', 
      icon: AiOutlineStar, 
      label: 'Starred messages',
      onClick: (e) => {
        e.stopPropagation();
        handleTabChange('starred');
      }
    },
    { 
      path: 'archived', 
      icon: BiArchive, 
      label: 'Archived',
      onClick: (e) => {
        e.stopPropagation();
        handleTabChange('archived');
      }
    },
  ];

  // Add handlers for profile menu
  const handleProfileClick = (e) => {
    e.stopPropagation();
    setProfileMenuTab('profile');
    setIsProfileMenuOpen(true);
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setProfileMenuTab('general');
    setIsProfileMenuOpen(true);
  };

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
    <div className="flex h-screen bg-[#F5F5F7]">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{
          top: 40,
          zIndex: 9999,
        }}
        toastOptions={{
          // Default options for all toasts
          className: 'font-["SF Pro Display"]',
          duration: 2000,
        }}
      />
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-white/5"
      >
        <HiMenuAlt2 className="w-6 h-6 text-gray-300" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full z-40
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isSidebarExpanded ? 'w-72' : 'w-20'}
          flex flex-col
          bg-white/95 backdrop-blur-xl
          border-r border-[#E5E5E5]
          shadow-[0_2px_20px_rgba(0,0,0,0.05)]
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-[#E5E5E5]">
          <span className="font-['SF Pro Display'] text-xl font-semibold">
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
                    ? 'text-black bg-black/5' 
                    : 'text-gray-500 hover:bg-black/5 hover:text-black'}
                `}
              >
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isSidebarExpanded ? '' : 'group-hover:scale-110'}`} />
                {isSidebarExpanded && (
                  <span className="ml-4 text-sm font-['SF Pro Display'] font-medium">
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
            onClick={handleSettingsClick}
            className="w-full h-14 flex items-center justify-start px-6
              transition-all duration-300 text-gray-500 
              hover:bg-black/5 hover:text-black"
          >
            <IoSettingsOutline className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-['SF Pro Display'] font-medium">Settings</span>
            )}
          </button>
          <button
            onClick={handleProfileClick}
            className="w-full h-14 flex items-center justify-start px-6
              transition-all duration-300 text-gray-500 
              hover:bg-black/5 hover:text-black"
          >
            <RxAvatar className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-['SF Pro Display'] font-medium">Profile</span>
            )}
          </button>
        </div>
      </aside>

      {/* Profile Menu */}
      <ProfileMenu 
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        initialTab={profileMenuTab}
      />

      {/* Contacts List */}
      <div className={`
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isSidebarExpanded ? 'lg:ml-72' : 'lg:ml-20'}
        w-80 h-screen overflow-hidden
        bg-white border-r border-[#E5E5E5]
        shadow-[1px_0_2px_rgba(0,0,0,0.05)]
      `}>
        {/* Search Header */}
        <div className="h-16 px-6 border-b border-[#E5E5E5] flex items-center">
          <div className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-xl 
                bg-[#F5F5F7] text-black placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-black/5 
                transition-all duration-300
                font-['SF Pro Display'] text-sm"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Contacts List */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] scrollbar-none">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className={`
                  flex items-center px-6 py-4 cursor-pointer
                  transition-all duration-300 border-b border-[#F5F5F7]
                  ${selectedChat === contact.id 
                    ? 'bg-[#F5F5F7]' 
                    : 'hover:bg-[#F5F5F7]'}
                `}
              >
                <div 
                  className="w-10 h-10 rounded-full bg-[#E5E5E5] flex items-center justify-center
                    transition-transform duration-300 hover:scale-105"
                >
                  <span className="text-black text-sm font-['SF Pro Display'] font-medium">
                    {contact.avatar}
                  </span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-black font-['SF Pro Display'] font-medium text-sm">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-500 font-['SF Pro Display']">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1 font-['SF Pro Display']">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <IoSearchOutline className="h-12 w-12 mb-4" />
              <p className="text-center font-['SF Pro Display'] text-sm">
                No results for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white flex flex-col">
        {selectedChat ? (
          <Message 
            selectedContact={selectedContact} 
            onClose={handleClose}
          />
        ) : (
          <motion.div 
            initial="initial"
            animate="animate"
            className="h-full flex items-center justify-center p-8 bg-[#F5F5F7]"
          >
            <div className="text-center max-w-2xl">
              <motion.h2 
                variants={contentVariants}
                className="text-5xl font-['SF Pro Display'] font-bold text-black mb-6"
              >
                Welcome to WebChat
              </motion.h2>
              <motion.p 
                variants={textVariants}
                className="text-xl text-gray-500 font-['SF Pro Display'] font-light"
              >
                Select a conversation to start messaging
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
