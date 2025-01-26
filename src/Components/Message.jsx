import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageBox from "../Components/MessageTemplate";
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';
import { IoEllipsisHorizontal, IoCall, IoVideocam, IoClose } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

export const encryptMessage = (message, symmetricKey) => {
  try {
    if (!message || !symmetricKey) {
      console.error('Missing message or key for encryption');
      return { body: message, isEncrypted: false };
    }
    
    console.log('Encryption attempt:', {
      message: message,
      keyAvailable: !!symmetricKey
    });

    const key = CryptoJS.SHA256(symmetricKey).toString();
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    
    console.log('Encryption result:', {
      success: !!encrypted,
      encryptedMessage: encrypted
    });

    return {
      body: encrypted,
      isEncrypted: true
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return { body: message, isEncrypted: false };
  }
};

export const decryptMessage = (encryptedMessage, symmetricKey) => {
  try {
    if (!encryptedMessage || !symmetricKey) {
      return encryptedMessage;
    }
    
    const key = CryptoJS.SHA256(symmetricKey).toString();
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    
    if (decryptedStr && decryptedStr.length > 0) {
      return decryptedStr;
    }
    
    return encryptedMessage;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage;
  }
};

const DateSeparator = ({ date }) => {
  const formatDate = (timestamp) => {
    // Convert Unix timestamp to milliseconds
    const messageDate = new Date(timestamp * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
        <span className="text-xs text-gray-400 font-['Graphik']">
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-amber-400 text-gray-900 px-0.5 rounded"
          data-highlight="true"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
};

export const Message = ({ selectedContact, onClose }) => {
  const [post, setPost] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const token = document.cookie;
  const symmetricKey = sessionStorage.getItem('symmetric_key');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);

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
        window.location.href = "/login";
      }
    } catch (err) {
      window.location.href = "/notfound";
    }
  };

  useEffect(() => {
    check_Auth();
  });

  const scrollToBottom = useCallback((behavior = 'auto') => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: behavior
      });
    }
  }, []);

  useEffect(() => {
    const initializeScroll = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };

    initializeScroll();
    setTimeout(initializeScroll, 100);
  }, []);

  const fetchMessages = async () => {
    if (loading) return;
    setLoading(true);

    try {
      console.log("Fetching messages");
      const response = await axios.get(`http://localhost:3000/posts`, {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
          'Content-Type': 'application/json',
        }
      });

      console.log("Raw response:", response.data);

      // Ensure response.data is an array
      const messages = Array.isArray(response.data) ? response.data : [];

      // Process messages with error handling
      const processedMessages = messages
        .filter(msg => msg && msg.content)
        .map(msg => {
          try {
            if (msg.content?.isEncrypted && symmetricKey) {
              try {
                const key = CryptoJS.SHA256(symmetricKey).toString();
                const bytes = CryptoJS.AES.decrypt(msg.content.body, key);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);

                return {
                  ...msg,
                  content: {
                    body: decrypted || msg.content.body,
                    isEncrypted: !decrypted
                  }
                };
              } catch (decryptError) {
                console.warn('Failed to decrypt message:', decryptError);
                return msg;
              }
            }
            
            return {
              ...msg,
              content: {
                body: msg.content.body || '',
                isEncrypted: false
              }
            };
          } catch (error) {
            console.error('Error processing message:', error);
            return null;
          }
        })
        .filter(Boolean);

      // Set posts and scroll to bottom
      setPost(prevPosts => {
        const newPosts = processedMessages.sort((a, b) => a.time - b.time);
        if (newPosts.length !== prevPosts.length) {
          setTimeout(() => scrollToBottom('auto'), 0);
        }
        return newPosts;
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []); // Only fetch once on mount

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      console.log("Sending new message:", {
        originalMessage: newMessage,
        symmetricKeyExists: !!symmetricKey
      });

      const encryptedData = encryptMessage(newMessage, symmetricKey);
      console.log("Encryption result:", encryptedData);

      // Add message to local state at the end of the array with animation
      setPost((prevPost) => [
        ...prevPost, 
        { 
          content: { 
            body: newMessage,
            isEncrypted: false
          }, 
          sender: userAddress,
          time: Math.floor(Date.now() / 1000),
          animation: true
        }
      ]);

      // Send encrypted message to server
      await axios.post('http://localhost:3000/message', {
        content: {
          body: encryptedData.body,
          isEncrypted: encryptedData.isEncrypted
        },
        time: Math.floor(Date.now() / 1000)
      }, {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
          'Content-Type': 'application/json',
        }
      });

      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
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
    setIsTyping(true);
  };

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newMessage]);   

  useEffect(() => {
    if (newMessage === '') {
      setIsTyping(false);
    }
  }, [newMessage]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchValue.trim()) {
      // Debounce search to improve performance
      searchTimeoutRef.current = setTimeout(() => {
        const matches = [];
        const messages = chatContainerRef.current.querySelectorAll('[data-highlight="true"]');
        
        messages.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const containerRect = chatContainerRef.current.getBoundingClientRect();
          
          matches.push({
            element,
            position: rect.top - containerRect.top + chatContainerRef.current.scrollTop
          });
        });
        
        setSearchMatches(matches);
        setCurrentSearchIndex(matches.length > 0 ? 0 : -1);
        
        // Scroll to first match
        if (matches.length > 0) {
          chatContainerRef.current.scrollTo({
            top: matches[0].position - containerRect.height / 2,
            behavior: 'smooth'
          });
        }
      }, 150); // Debounce delay
    } else {
      setSearchMatches([]);
      setCurrentSearchIndex(-1);
    }
  };

  const handleSearchNavigation = (direction) => {
    if (searchMatches.length === 0) return;
    
    let newIndex;
    if (direction === 'up') {
      newIndex = currentSearchIndex <= 0 ? searchMatches.length - 1 : currentSearchIndex - 1;
    } else {
      newIndex = currentSearchIndex >= searchMatches.length - 1 ? 0 : currentSearchIndex + 1;
    }
    
    setCurrentSearchIndex(newIndex);
    
    const match = searchMatches[newIndex];
    if (match) {
      const containerRect = chatContainerRef.current.getBoundingClientRect();
      chatContainerRef.current.scrollTo({
        top: match.position - containerRect.height / 2,
        behavior: 'smooth'
      });
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setSearchTerm('');
    setSearchMatches([]);
    setCurrentSearchIndex(-1);
  };

  // Update the message rendering to use react-highlight-words
  const renderMessage = (item, index) => {
    const isMyMessage = item.sender === userAddress;
    
    return (
      <motion.div
        key={`msg-${item.time}-${index}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <MessageBox
          isMyMessage={isMyMessage}
          Message={highlightText(item.content.body, searchTerm)}
          Address={item.sender}
          isEncrypted={item.content.isEncrypted}
          timestamp={item.time}
        />
      </motion.div>
    );
  };

  // Performance optimization: Memoize messages
  const memoizedMessages = useMemo(() => {
    return post
      .filter((item) => item.content?.body?.trim() !== "")
      .reduce((acc, item, index, array) => {
        const messageDate = new Date(item.time * 1000);
        const prevMessageDate = index > 0 
          ? new Date(array[index - 1]?.time * 1000) 
          : null;

        if (
          index === 0 || 
          !prevMessageDate || 
          messageDate.toDateString() !== prevMessageDate.toDateString()
        ) {
          acc.push(
            <DateSeparator
              key={`date-${item.time}-${index}`}
              date={item.time}
            />
          );
        }

        acc.push(renderMessage(item, index));
        return acc;
      }, []);
  }, [post, searchTerm, userAddress]);

  // Add keyboard shortcut listener for Ctrl+F
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        toggleSearch();
      } else if (e.key === 'Escape' && isSearchActive) {
        toggleSearch();
      } else if (isSearchActive && searchMatches.length > 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (e.shiftKey) {
            handleSearchNavigation('up');
          } else {
            handleSearchNavigation('down');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSearchActive, searchMatches.length]);

  const handleClose = () => {
    toast.success('Chat closed successfully', {
      duration: 1000,
      position: 'top-center',
      style: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        borderRadius: '12px',
      },
    });
    onClose();
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <header className="bg-white/5 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="font-['Freight_Disp_Pro'] text-white text-lg">
              {selectedContact?.avatar || 'A'}
            </span>
          </div>
          <h1 className="ml-4 font-['Freight_Disp_Pro'] text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {selectedContact?.name || 'Aleph Test Group Chat'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleSearch} className="text-gray-400 hover:text-white transition-colors duration-300">
            <IoSearchOutline size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-300">
            <IoCall size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-300">
            <IoVideocam size={24} />
          </button>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors duration-300">
            <IoEllipsisHorizontal size={24} />
          </button>
        </div>
      </header>

      {isSearchActive && (
        <div className="bg-white/5 backdrop-blur-sm px-6 py-2 border-b border-white/10">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-gray-400">
              <IoSearchOutline size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search in chat..."
              className="w-full pl-10 pr-32 py-2 rounded-lg bg-black/20 text-white placeholder-gray-400 
                       focus:outline-none focus:ring-1 focus:ring-purple-500/50 
                       border border-white/10 transition-all duration-300"
              autoFocus
            />
            <div className="absolute right-2 flex items-center space-x-2 bg-black/20 rounded-md px-2 py-1">
              {searchTerm && searchMatches.length > 0 && (
                <>
                  <span className="text-sm text-gray-400 px-2 border-r border-gray-600">
                    {`${currentSearchIndex + 1}/${searchMatches.length}`}
                  </span>
                </>
              )}
              <button
                onClick={() => handleSearchNavigation('up')}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 hover:bg-white/5 rounded"
                disabled={!searchTerm || searchMatches.length === 0}
                title="Previous match"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => handleSearchNavigation('down')}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 hover:bg-white/5 rounded"
                disabled={!searchTerm || searchMatches.length === 0}
                title="Next match"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="h-4 w-[1px] bg-gray-600" />
              <button
                onClick={toggleSearch}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors duration-300"
                title="Close search (Esc)"
              >
                <IoClose size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-white/5 hover:scrollbar-thumb-purple-500/50 transition-colors duration-300"
        style={{ 
          height: 'calc(100vh - 120px)',
          scrollBehavior: 'smooth',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {loading && (
          <div className="text-center py-4 text-gray-400">Loading...</div>
        )}
        {post.length > 0 && (
          <div className="px-6 py-4 flex flex-col">
            {memoizedMessages}
          </div>
        )}
        {isTyping && (
          <motion.div
            className="text-gray-400 text-sm px-6 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            Typing...
          </motion.div>
        )}
      </div>

      <footer className="bg-white/5 backdrop-blur-sm px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <textarea
            placeholder="Type a message..."
            className="flex-grow p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none
                     scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-white/5 
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
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl 
                     hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-['Graphik']"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};