import React from "react";
import { useParams } from "react-router-dom";
import { MdOutlineChatBubbleOutline, MdOutlinePhone } from "react-icons/md";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import MessageBox from "../components/MessageTemplate";

export const Room = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [userAddress, setUserAddress] = useState("");
    const [page, setPage] = useState(1);
    const chatContainerRef = useRef(null);
    const token = document.cookie;
    const { name } = useParams();
    let prevScrollHeight = 0;

    const check_Auth = async () => {
      try {
        const req = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: "Bearer " + token.split('=')[1],
            'Content-Type': 'application/json',
          }
        });
        setUserAddress(req.data.user.address);
        if (req.data === 'Access denied') {
          window.location.href = "/signin";
        }
      } catch (err) {
        window.location.href = "/signin";
      }
    };

    const fetchMessages = async (pageNum) => {
        if (loading) return;
        setLoading(true);
    
        try {
          const chatContainer = chatContainerRef.current;
          prevScrollHeight = chatContainer.scrollHeight;
    
          const req = await axios.get(`http://localhost:3000/posts/${name}?page=${pageNum}`, {
            headers: {
              Authorization: "Bearer " + token.split('=')[1],
              'Content-Type': 'application/json',
            },
          });
    
          const temp_data = req.data;
          const te_data = temp_data.reverse();
          if (temp_data.length > 0) {
            setPost((prevPost) => [...te_data, ...prevPost]);
            setTimeout(() => {
              chatContainer.scrollTop = chatContainer.scrollHeight - prevScrollHeight;
            }, 0);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        } catch (err) {
          console.error('Fetch error', err);
          setLoading(false);
        }
    };

    const handleScroll = () => {
      if (chatContainerRef.current.scrollTop === 0 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const sendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
        const response = await axios.post(`http://localhost:3000/posts/${name}`, 
          { content: { body: newMessage, isEncrypted: true } },
          {
            headers: {
              Authorization: "Bearer " + token.split('=')[1],
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          setPost((prevPost) => [...prevPost, { 
            content: { body: newMessage }, 
            sender: userAddress,
            timestamp: new Date().toISOString()
          }]);
          setNewMessage('');

          setTimeout(() => {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }, 100);
        }
      } catch (err) {
        console.log("Error sending message:", err);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          e.preventDefault();
          const cursorPosition = e.target.selectionStart;
          const newValue = newMessage.slice(0, cursorPosition) + '\n' + newMessage.slice(cursorPosition);
          setNewMessage(newValue);
          
          setTimeout(() => {
            const textarea = e.target;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
          }, 0);
        } else {
          e.preventDefault();
          sendMessage(e);
        }
      }
    };

    useEffect(() => {
      check_Auth();
      fetchMessages(page);

      const chatContainer = chatContainerRef.current;
      chatContainer.addEventListener('scroll', handleScroll);

      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }, [page, name]);

    useEffect(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [newMessage]);

    return (
        <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            {/* Sidebar */}
            <div className="w-20 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col items-center justify-center space-y-8">
                <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
                    <MdOutlineChatBubbleOutline className="h-8 w-8 text-purple-400" />
                </div>
                <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
                    <MdOutlinePhone className="h-8 w-8 text-purple-400" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-slate-900/95">
                <div className="h-screen flex flex-col">
                    {/* Header */}
                    <header className="bg-white/5 backdrop-blur-sm px-6 py-4 flex items-center border-b border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="font-['Freight_Disp_Pro'] text-white text-lg">
                                {name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h1 className="ml-4 font-['Freight_Disp_Pro'] text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {name}
                        </h1>
                    </header>

                    {/* Messages Area */}
                    <div
                        ref={chatContainerRef}
                        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 
                                 scrollbar-track-white/5 hover:scrollbar-thumb-purple-500/50 
                                 transition-colors duration-300"
                        style={{ height: 'calc(100vh - 120px)' }}
                    >
                        {loading && page === 1 && (
                          <div className="text-center py-4 text-gray-400">Loading...</div>
                        )}
                        <div className="px-6 py-4">
                            {post.map((message, index) => (
                                <MessageBox
                                    key={index}
                                    isMyMessage={message.sender === userAddress}
                                    Message={message.content?.body || message.content}
                                    Address={message.sender}
                                    timestamp={message.timestamp}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Message Input */}
                    <footer className="bg-white/5 backdrop-blur-sm px-6 py-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <textarea
                                placeholder="Type a message..."
                                className="flex-grow p-3 rounded-xl bg-white/5 border border-white/10 text-white 
                                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                                         transition-all duration-300 resize-none scrollbar-thin 
                                         scrollbar-thumb-purple-500/30 scrollbar-track-white/5 
                                         hover:scrollbar-thumb-purple-500/50"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                rows="1"
                                style={{ 
                                    minHeight: '44px',
                                    maxHeight: '120px',
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 
                                         rounded-xl hover:shadow-lg hover:shadow-purple-500/30 
                                         transition-all duration-300 font-['Graphik']"
                            >
                                Send
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};
