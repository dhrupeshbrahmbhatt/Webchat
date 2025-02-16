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

export const ProfileMenu = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

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
    if (!isPrivateKeyVisible) {
      setTimeout(() => setIsPrivateKeyVisible(false), 30000);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
        }
      });
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            className="fixed left-[72px] bottom-4 w-[500px] h-[550px] 
              bg-white rounded-2xl shadow-2xl z-50 
              font-['SF_Pro_Display'] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="h-full overflow-y-auto p-6 space-y-6">
              {/* Profile Overview */}
              <div className="bg-[#f5f5f7] p-6 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white text-xl">
                      {userData?.name ? userData.name[0].toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">{userData?.name}</h3>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                  </div>
                </div>
              </div>

              {/* Chain Identity */}
              <div className="bg-[#f5f5f7] p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-black">CHAIN_IDENTITY</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">WALLET_ADDRESS</label>
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                      <code className="text-sm text-black flex-1 font-mono">
                        {userData?.address}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(userData?.address);
                          toast.success('Address copied');
                        }}
                        className="ml-2 p-2 hover:bg-[#f5f5f7] rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">SECURE_KEY_MATRIX</label>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-mono text-sm text-black break-all">
                        {isPrivateKeyVisible ? (
                          <div className="overflow-x-auto whitespace-normal">
                            {userData?.private_key}
                          </div>
                        ) : (
                          '••••••••••••••••••••••••••••••••'
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {isPrivateKeyVisible ? 'Auto-hide in 30s' : 'Protected'}
                        </span>
                        <button
                          onClick={handleRevealPrivateKey}
                          className="text-xs text-black hover:bg-[#f5f5f7] px-3 py-1 rounded-lg transition-colors"
                        >
                          {isPrivateKeyVisible ? 'CONCEAL' : 'REVEAL'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">RECOVERY_SEQUENCE</label>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-3 gap-2">
                        {userData?.mnemonics?.split(' ').map((word, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{index + 1}.</span>
                            <span className="text-sm text-black font-mono">{word}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-[#f5f5f7] p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-black">SECURITY_PROTOCOL</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">2FA_MATRIX</span>
                    <Switch
                      checked={readReceipts}
                      onChange={setReadReceipts}
                      className={`${
                        readReceipts ? 'bg-black' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span className={`${
                        readReceipts ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                    </Switch>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">QUANTUM_SHIELD</span>
                    <Switch
                      checked={true}
                      disabled={true}
                      className={`
                        bg-black relative inline-flex h-6 w-11 
                        items-center rounded-full transition-colors 
                        cursor-not-allowed opacity-90
                      `}
                    >
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"/>
                    </Switch>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-4">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  INITIATE_LOGOUT_SEQUENCE
                </button>
                <p className="mt-2 text-xs text-gray-400 text-center">
                  Local matrix will be cleared upon logout
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};