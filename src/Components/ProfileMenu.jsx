import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  IoSettingsOutline, 
  IoNotificationsOutline,
  IoKeyOutline,
  IoFolderOutline,
  IoInformationCircleOutline,
  IoChatboxOutline,
  IoVideocamOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { CiKeyboard } from "react-icons/ci";
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

export const ProfileMenu = ({ isOpen, onClose, initialTab = 'general' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userData, setUserData] = useState(null);
  const [storageUsage, setStorageUsage] = useState({
    total: 16, // GB
    used: 5.7,  // GB
    media: 3.2, // GB
    docs: 1.5,  // GB
    other: 1.0  // GB
  });
  const [startAtLogin, setStartAtLogin] = useState(false);
  const [replaceEmoji, setReplaceEmoji] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('System default');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);

  const token = document.cookie;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: "Bearer " + token.split('=')[1],
            'Content-Type': 'application/json',
          }
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, token]);

  const handleRevealPrivateKey = () => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
    // Auto-hide after 30 seconds for security
    if (!isPrivateKeyVisible) {
      setTimeout(() => setIsPrivateKeyVisible(false), 30000);
    }
  };

  const renderGeneralSettings = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl text-white font-['Freight_Disp_Pro']">General</h2>
      
      {/* Login Section */}
      <div className="space-y-4">
        <h3 className="text-base text-white">Login</h3>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-300">Start WebChat at login</span>
          <Switch
            checked={startAtLogin}
            onChange={setStartAtLogin}
            className={`${
              startAtLogin ? 'bg-purple-500' : 'bg-gray-600'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only text-[10px] ">Start at login</span>
            <span
              className={`${
                startAtLogin ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      {/* Language Section */}
      <div className="space-y-4">
        <h3 className="text-lg text-white">Language</h3>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-[#2a3942] text-gray-300 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>System default</option>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
          <button className="text-purple-400 text-sm hover:text-purple-300">
            See list of text
          </button>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl text-white font-['Freight_Disp_Pro']">Account</h2>
      {userData && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-300">Email</p>
            <p className="text-white">{userData.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">Username</p>
            <p className="text-white">{userData.username}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  const renderStorageSettings = () => (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl text-white font-['Freight_Disp_Pro']">Storage</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Storage Used</span>
            <span>{storageUsage.used}GB / {storageUsage.total}GB</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Storage breakdown</p>
          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span>Media</span>
              <span>{storageUsage.media}GB</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Documents</span>
              <span>{storageUsage.docs}GB</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Other</span>
              <span>{storageUsage.other}GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKeyboardShortcuts = () => (
    <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin 
      scrollbar-thumb-purple-400/20 scrollbar-track-[#2a3942]/20 
      hover:scrollbar-thumb-purple-400/40">
      <h2 className="text-2xl text-white font-['Freight_Disp_Pro']">Keyboard Shortcuts</h2>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg text-white">General</h3>
          <div className="space-y-2">
            {[
              { keys: ['Ctrl', 'N'], description: 'New chat' },
              { keys: ['Ctrl', 'F'], description: 'Search chats' },
              { keys: ['Ctrl', ','], description: 'Open settings' },
              { keys: ['Ctrl', 'M'], description: 'Mute/unmute' },
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-300">{shortcut.description}</span>
                <div className="flex items-center space-x-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="px-2 py-1 bg-[#2a3942] rounded text-sm text-gray-300 border border-white/10">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && <span className="text-gray-400">+</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg text-white">Chat</h3>
          <div className="space-y-2">
            {[
              { keys: ['Ctrl', 'E'], description: 'Archive chat' },
              { keys: ['Ctrl', 'Shift', 'M'], description: 'Mark as unread' },
              { keys: ['Ctrl', 'Backspace'], description: 'Delete chat' },
              { keys: ['Alt', 'Down'], description: 'Next chat' },
              { keys: ['Alt', 'Up'], description: 'Previous chat' },
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-300">{shortcut.description}</span>
                <div className="flex items-center space-x-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="px-2 py-1 bg-[#2a3942] rounded text-sm text-gray-300 border border-white/10">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && <span className="text-gray-400">+</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatSettings = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl text-white font-medium">Chats</h2>
      
      {/* Chat History Section */}
      <div className="space-y-3">
        <h3 className="text-sm text-white/90">Chat history</h3>
        
        <div className="flex items-center space-x-2 text-gray-300 text-sm py-1">
          <span className="inline-block">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M16 16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v8zm-4-3.7V9.7l-2.5 1.3-2.5 1.3 2.5 1.3 2.5 1.3zm6-7.3h-2v2h2v8h-2v2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/>
            </svg>
          </span>
          <span>Synced with your phone</span>
        </div>

        <button className="w-full text-left px-3 py-2 bg-[#2a3942] rounded text-sm text-gray-300 hover:bg-[#3b4a54] transition-colors">
          Archive all chats
        </button>
        <p className="text-xs text-gray-400 pl-1">You will still receive new messages from archived chats</p>

        <button className="w-full text-left px-3 py-2 bg-[#2a3942] rounded text-sm text-red-400 hover:bg-[#3b4a54] transition-colors">
          Clear all messages
        </button>
        <p className="text-xs text-gray-400 pl-1">Delete all messages from chats and groups</p>

        <button className="w-full text-left px-3 py-2 bg-[#2a3942] rounded text-sm text-red-400 hover:bg-[#3b4a54] transition-colors">
          Delete all chats
        </button>
        <p className="text-xs text-gray-400 pl-1">Delete all messages and clear the chats from your history</p>
      </div>

      {/* Chat Display Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm text-white/90">Chat display</h3>
        
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm text-gray-300">Show online status</span>
            <p className="text-xs text-gray-400">Display when contacts are online</p>
          </div>
          <Switch
            checked={showOnlineStatus}
            onChange={setShowOnlineStatus}
            className={`${showOnlineStatus ? 'bg-purple-500' : 'bg-gray-600'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Show online status</span>
            <span className={`${showOnlineStatus ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}/>
          </Switch>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm text-gray-300">Read receipts</span>
            <p className="text-xs text-gray-400">Show when you've read messages</p>
          </div>
          <Switch
            checked={readReceipts}
            onChange={setReadReceipts}
            className={`${readReceipts ? 'bg-purple-500' : 'bg-gray-600'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Read receipts</span>
            <span className={`${readReceipts ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}/>
          </Switch>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="p-4 space-y-6 overflow-y-auto scrollbar-thin 
      scrollbar-thumb-purple-400/20 scrollbar-track-[#2a3942]/20
      hover:scrollbar-thumb-purple-400/40">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-3 mb-6">
        {userData?.profilePhoto ? (
          <img 
            src={userData.profilePhoto} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white text-3xl">
              {userData?.name ? userData.name[0].toUpperCase() : '?'}
            </span>
          </div>
        )}
        
        <div className="text-center">
          <h2 className="text-xl text-white font-medium">
            {userData?.name || 'Username'}
          </h2>
          <button 
            className="mt-1 text-purple-400 hover:text-purple-300 flex items-center justify-center text-sm"
            onClick={() => {/* Add edit handler */}}
          >
            <span>Edit</span>
            <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* User Identity Section */}
      <div className="space-y-4 bg-[#1a1f23] p-4 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-purple-400 font-medium">Identity</h3>
          <span className="text-xs text-gray-400">Secured by RSA Encryption</span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-white bg-[#2a3942] p-2 rounded">{userData?.name}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-white bg-[#2a3942] p-2 rounded">{userData?.email}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400">About</label>
            <div className="group relative">
              <p className="text-white bg-[#2a3942] p-2 rounded pr-8">
                {userData?.about || "Loyalty is a Two way street If i am asking it From you, you're getting it from me."}
              </p>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {/* Add edit handler */}}
              >
                <svg className="w-3.5 h-3.5 text-purple-400 hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Details Section */}
      <div className="space-y-4 bg-[#1a1f23] p-4 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-purple-400 font-medium">Wallet Details</h3>
          <span className="text-xs text-gray-400">Protected by AES-256</span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Wallet Address</label>
            <div className="flex items-center bg-[#2a3942] p-2 rounded group">
              <p className="flex-1 font-mono text-sm text-white overflow-hidden text-ellipsis">
                {userData?.address}
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(userData?.address);
                  toast.success('Address copied to clipboard!');
                }}
                className="ml-2 px-3 py-1 text-xs text-purple-400 hover:text-purple-300 
                  border border-purple-400/20 rounded-full hover:bg-purple-400/10 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Private Key Display */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Private Key</label>
            <div className="relative">
              <div className="bg-[#2a3942] p-2 rounded font-mono text-sm flex items-center justify-between">
                <span className="text-white overflow-hidden text-ellipsis">
                  {isPrivateKeyVisible 
                    ? userData?.private_key
                    : '••••••••••••••••••••••••••••••••'}
                </span>
                <button 
                  onClick={handleRevealPrivateKey}
                  className="ml-2 px-3 py-1 text-xs text-purple-400 hover:text-purple-300 
                    border border-purple-400/20 rounded-full hover:bg-purple-400/10 transition-colors"
                >
                  {isPrivateKeyVisible ? 'Hide' : 'Reveal'}
                </button>
              </div>
              {isPrivateKeyVisible && (
                <p className="text-xs text-red-400 mt-1">
                  Key will be hidden automatically after 30 seconds
                </p>
              )}
            </div>
          </div>

          {/* Recovery Phrase */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Recovery Phrase</label>
            <div className="bg-[#2a3942] p-3 rounded">
              <div className="grid grid-cols-3 gap-2">
                {userData?.mnemonics.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 text-xs mr-2">{index + 1}.</span>
                    <span className="text-white text-sm font-mono">{word}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-red-400 mt-2">
              Never share your recovery phrase with anyone. Store it securely.
            </p>
          </div>
        </div>
      </div>

      {/* Encryption Keys Section */}
      <div className="space-y-4 bg-[#1a1f23] p-4 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-purple-400 font-medium">Encryption Keys</h3>
          <span className="text-xs text-gray-400">RSA-2048</span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Public Key</label>
            <div className="relative">
              <div className="absolute -top-2 right-2 z-10">
                <div className="px-3 py-1 text-xs text-red-400/80 
                  bg-[#2a3942] rounded-full border border-red-400/20
                  shadow-lg shadow-black/20">
                  Protected
                </div>
              </div>
              <pre 
                className="text-white bg-[#2a3942] p-2 rounded font-mono text-xs h-20 
                  overflow-y-auto scrollbar-thin scrollbar-rounded scrollbar-thumb-purple-400/20 
                  scrollbar-track-[#2a3942]/40 hover:scrollbar-thumb-purple-400/40
                  select-none pointer-events-none"
                onCopy={(e) => e.preventDefault()}
                style={{ WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none' }}
              >
                {userData?.encryption_Public_Key?.replace(/(.{40})/g, '$1\n')}
              </pre>
            </div>
            <p className="text-xs text-red-400 mt-1">
              Encryption keys are managed automatically for your security
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Security Warning */}
      <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <h4 className="text-red-400 font-medium mb-1">Security Notice</h4>
            <p className="text-red-400/80 text-sm">
              Your encryption keys are managed securely by the system. Never attempt to copy or share these keys.
              They are essential for your account's security.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="pt-3 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-400 bg-[#2a3942] rounded hover:bg-[#3b4a54] transition-colors"
        >
          Log out
        </button>
        <p className="mt-1 text-xs text-gray-400 pl-1">
          Chat history on this computer will be cleared when you log out.
        </p>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'general', icon: IoSettingsOutline, label: 'General' },
    { id: 'account', icon: IoKeyOutline, label: 'Account' },
    { id: 'chats', icon: IoChatboxOutline, label: 'Chats' },
    { id: 'video', icon: IoVideocamOutline, label: 'Video & voice' },
    { id: 'notifications', icon: IoNotificationsOutline, label: 'Notifications' },
    { id: 'keyboard', icon: CiKeyboard , label: 'Keyboard shortcuts' },
    { id: 'storage', icon: IoFolderOutline, label: 'Storage' },
    { id: 'help', icon: IoInformationCircleOutline, label: 'Help' },
  ];

  const handleLogout = async () => {
    // try {
    //   await axios.post('http://localhost:3000/logout', {}, {
    //     headers: {
    //       Authorization: "Bearer " + token.split('=')[1],
    //     }
    //   });
    //   document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    //   window.location.href = '/login';
    // } catch (error) {
    //   console.error('Logout failed:', error);
    // }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            className="fixed left-[72px] bottom-4 w-[500px] h-[650px] bg-[#202c33] 
              rounded-lg shadow-lg z-50 overflow-hidden border border-white/10"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex h-full">
              {/* Enhanced Sidebar */}
              <div className="w-[120px] bg-[#1a1f23] py-2 flex flex-col border-r border-white/5">
                <div className="flex-1 overflow-y-auto scrollbar-none">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-3 py-3 flex flex-col items-center justify-center space-y-1.5 
                        transition-all duration-200 relative group
                        ${activeTab === item.id 
                          ? 'text-purple-400 bg-white/5' 
                          : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'}`}
                    >
                      {activeTab === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-400 rounded-r" />
                      )}
                      <item.icon className={`w-5 h-5 transition-transform duration-200 
                        ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`} 
                      />
                      <span className={`text-xs font-medium transition-colors duration-200
                        ${activeTab === item.id ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Profile button */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`mt-auto p-3 border-t border-white/5 w-full transition-all duration-200
                    group relative
                    ${activeTab === 'profile' 
                      ? 'text-purple-400 bg-white/5' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'}`}
                >
                  {activeTab === 'profile' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-400 rounded-r" />
                  )}
                  <div className="flex flex-col items-center space-y-1.5">
                    <IoPersonOutline className={`w-5 h-5 transition-transform duration-200
                      ${activeTab === 'profile' ? 'scale-110' : 'group-hover:scale-105'}`} 
                    />
                    <span className={`text-xs font-medium transition-colors duration-200
                      ${activeTab === 'profile' ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      Profile
                    </span>
                  </div>
                </button>
              </div>

              {/* Content Area with enhanced scrollbar */}
              <div className="flex-1 overflow-y-auto scrollbar-thin 
                scrollbar-thumb-purple-400/20 scrollbar-track-[#2a3942]/20 
                hover:scrollbar-thumb-purple-400/40">
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'account' && renderAccountSettings()}
                {activeTab === 'storage' && renderStorageSettings()}
                {activeTab === 'keyboard' && renderKeyboardShortcuts()}
                {activeTab === 'chats' && renderChatSettings()}
                {activeTab === 'profile' && renderProfileSettings()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};