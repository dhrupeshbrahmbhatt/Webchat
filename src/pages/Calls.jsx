import React, { useState } from 'react';
import { MdOutlineChatBubbleOutline, MdOutlinePhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const Calls = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calls');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Sidebar */}
      <div className="w-20 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col items-center justify-center space-y-8">
        <div 
          className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
            activeTab === 'chat' 
              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-lg shadow-purple-500/10' 
              : 'bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => handleTabChange('chat')}
        >
          <MdOutlineChatBubbleOutline className={`h-8 w-8 ${
            activeTab === 'chat' ? 'text-purple-400' : 'text-gray-400'
          }`} />
        </div>
        <div 
          className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
            activeTab === 'calls' 
              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-lg shadow-purple-500/10' 
              : 'bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => handleTabChange('calls')}
        >
          <MdOutlinePhone className={`h-8 w-8 ${
            activeTab === 'calls' ? 'text-purple-400' : 'text-gray-400'
          }`} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-900/95">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-['Freight_Disp_Pro'] text-gray-400 mb-2">Calls Feature</h2>
            <p className="text-gray-500 text-2xl">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 