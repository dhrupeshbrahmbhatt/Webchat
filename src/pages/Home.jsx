import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineChatBubbleOutline, MdOutlinePhone } from "react-icons/md";
import { Message } from '../Components/Message';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

export const Home = () => {
  const token = document.cookie;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

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
      navigate('/calls');
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

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Toaster position="top-center" reverseOrder={false}/>
      
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

      {/* Contacts List */}
      <div className="w-80 overflow-hidden bg-black/10 backdrop-blur-sm border-r border-white/10">
        {/* Updated Search Section */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {searchQuery && (
              <div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 cursor-pointer hover:text-white"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredContacts(demoContacts); // Reset to show all contacts
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
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-6xl font-['Freight_Disp_Pro'] text-gray-400 mb-2">Welcome to Webchat</h2>
                <p className="text-gray-500 text-2xl">Select a contact to start messaging</p>
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-['Freight_Disp_Pro'] text-gray-400 mb-2">Calls Feature</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
