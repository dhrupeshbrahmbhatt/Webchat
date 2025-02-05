import React, { useState, useEffect } from "react";
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

  const handleCloseChat = () => {
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
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Toaster position="top-center" reverseOrder={false}/>
      
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

      {/* Updated Sidebar with theme colors */}
      <aside 
        className={`
          fixed left-0 top-0 h-full z-40
          transition-all duration-300 ease-in-out
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
                  transition-all duration-200 group
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
            onClick={handleSettingsClick}
            className="w-full h-12 flex items-center justify-start px-6
              transition-all duration-200 text-gray-400 
              hover:bg-white/5 hover:text-purple-400"
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
            onClick={handleProfileClick}
            className="w-full h-12 flex items-center justify-start px-6
              transition-all duration-200 text-gray-400 
              hover:bg-white/5 hover:text-purple-400"
          >
            <RxAvatar className="w-6 h-6" />
            {isSidebarExpanded && (
              <span className="ml-4 text-sm font-medium">Profile</span>
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

      {/* Updated Contacts List with theme-consistent styling */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-[72px]'}
        w-80 overflow-hidden bg-black/10 backdrop-blur-sm border-r border-white/10
      `}>
        {/* Updated Search Section */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500 transition-all duration-300"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {searchQuery && (
              <div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs 
                  text-gray-400 cursor-pointer hover:text-purple-400"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredContacts(demoContacts);
                }}
              >
                Clear
              </div>
            )}
          </div>
        </div>

        {/* Updated Contacts List with Search Results */}
        <div className="overflow-y-auto h-[calc(100vh-72px)] scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-white/5">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                data-contact-id={contact.id}
                className={`flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors duration-200 ${
                  selectedChat === contact.id ? 'bg-white/10' : ''
                }`}
                onClick={() => handleContactClick(contact)}
              >
                <div 
                  className="min-w-[48px] w-12 h-12 rounded-full relative flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, rgb(168, 85, 247), rgb(59, 130, 246))`,
                  }}
                >
                  <span className="text-white text-lg font-semibold">
                    {contact.avatar}
                  </span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-['Freight_Disp_Pro'] truncate mr-2">{contact.name}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate max-w-[180px]">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <IoSearchOutline className="h-12 w-12 mb-4" />
              <p className="text-center">No contacts found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-900/95">
        {activeTab === 'chat' ? (
          selectedChat ? (
            <Message selectedContact={selectedContact} onClose={handleCloseChat} />
          ) : (
            <motion.div 
              initial="initial"
              animate="animate"
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h2 
                  variants={contentVariants}
                  className="text-6xl font-['Freight_Disp_Pro'] text-gray-400 mb-2 
                    bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
                >
                  Welcome to Webchat
                </motion.h2>
                <motion.p 
                  variants={textVariants}
                  className="text-gray-500 text-2xl hover:text-purple-400"
                >
                  Select a contact to start messaging
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
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div 
            initial="initial"
            animate="animate"
            className="h-full flex items-center justify-center"
          >
            <div className="text-center">
              <motion.h2 
                variants={contentVariants}
                className="text-6xl font-['Freight_Disp_Pro'] text-gray-400 mb-2 
                  bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
              >
                Welcome to Webchat
              </motion.h2>
              <motion.p 
                variants={textVariants}
                className="text-gray-500 text-2xl hover:text-purple-400"
              >
                Select a contact to start messaging
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
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
