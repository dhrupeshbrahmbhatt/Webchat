import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageBox from "../Components/MessageTemplate";
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';
import { IoEllipsisHorizontal, IoCall, IoVideocam, IoClose, IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { RxAvatar } from 'react-icons/rx';
import { Toaster } from 'react-hot-toast';
import ChatCalendar from './ChatCalendar';

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

const DateSeparator = ({ date, chatDates, onDateSelect }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (timestamp) => {
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
    <>
      <div 
        className="flex items-center justify-center my-4 cursor-pointer"
        onClick={() => setIsCalendarOpen(true)}
      >
        <div className="px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
          <span className="text-xs text-gray-400 font-['Graphik']">
            {formatDate(date)}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isCalendarOpen && (
          <ChatCalendar
            chatDates={chatDates}
            onDateSelect={(selectedDate) => {
              onDateSelect(selectedDate);
              setIsCalendarOpen(false);
            }}
            onClose={() => setIsCalendarOpen(false)}
            selectedDate={new Date(date * 1000)}
          />
        )}
      </AnimatePresence>
    </>
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

const ChatMessage = ({ isMyMessage, Message, Address, isEncrypted, timestamp }) => {
  const formattedTime = new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isMyMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 mt-1">
          <RxAvatar className="w-5 h-5 text-gray-500" />
        </div>
      )}
      <div className="flex flex-col">
        <div className={`
          group inline-flex px-4 py-2.5 rounded-2xl
          ${isMyMessage ? 
            'bg-[#1a8cd8] text-white' : 
            'bg-[#f7f7f7] text-[#0f1419]'}
        `}>
          {isEncrypted ? (
            <div className="font-mono text-sm opacity-50 break-all">
              {Message}
            </div>
          ) : (
            <div className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">
              {Message}
            </div>
          )}
        </div>
        <div className={`
          flex items-center gap-2 mt-1
          ${isMyMessage ? 'justify-end' : 'justify-start'}
        `}>
          <span className="text-xs text-[#536471]">{formattedTime}</span>
          {isMyMessage && (
            <span className="text-xs text-[#536471]">•</span>
          )}
        </div>
      </div>
    </div>
  );
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

  const scrollToDate = (date) => {
    // Convert selected date to start and end timestamps for that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    // Find the first message from that day
    const messageElement = post.find(message => 
      message.time >= startTimestamp && message.time <= endTimestamp
    );

    if (messageElement) {
      const element = document.querySelector(`[data-timestamp="${messageElement.time}"]`);
      if (element) {
        // Scroll the element into view with a smooth animation
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Add a temporary highlight effect
        element.classList.add('bg-black/5');
        setTimeout(() => {
          element.classList.remove('bg-black/5');
        }, 2000);
      }
    } else {
      toast.error('No messages found for this date', {
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          borderRadius: '12px',
        },
      });
    }
  };

  // Update the message rendering to include data-timestamp
  const renderMessage = (item, index) => {
    const isMyMessage = item.sender === userAddress;
    
    return (
      <motion.div
        key={`msg-${item.time}-${index}`}
        data-timestamp={item.time}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="transition-colors duration-300"
      >
        <ChatMessage
          isMyMessage={isMyMessage}
          Message={highlightText(item.content.body, searchTerm)}
          Address={item.sender}
          isEncrypted={item.content.isEncrypted}
          timestamp={item.time}
        />
      </motion.div>
    );
  };

  // Update memoizedMessages to ensure data-timestamp is properly set
  const memoizedMessages = useMemo(() => {
    const chatDates = post.map(item => item.time);
    
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
              chatDates={chatDates}
              onDateSelect={scrollToDate}
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
        color: '#000',
        borderRadius: '12px',
      },
    });
    onClose();
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-16 px-6 bg-white sticky top-0 z-10 
        border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-gray-600 font-medium">
              {selectedContact?.avatar || 'A'}
            </span>
          </div>
          <h1 className="text-[#0f1419] text-lg font-semibold">
            {selectedContact?.name || 'Group Chat'}
          </h1>
        </div>
        <div className="flex items-center space-x-5">
          <button onClick={toggleSearch} 
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <IoSearchOutline size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <IoSettingsOutline size={20} />
          </button>
          <button onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <IoClose size={20} />
          </button>
        </div>
      </header>

      {isSearchActive && (
        <div className="border-b border-gray-100 px-6 py-2 bg-white">
          <div className="relative flex items-center">
            <IoSearchOutline className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search in conversation"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 
                text-gray-900 placeholder-gray-400 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#1a8cd8]/20"
              autoFocus
            />
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-6 py-4
          scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        style={{ 
          height: 'calc(100vh - 144px)',
          scrollBehavior: 'smooth',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-1">
            {memoizedMessages}
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-100 px-6 py-4 sticky bottom-0">
        <div className="flex items-center gap-3">
          <textarea
            placeholder="Message"
            className="flex-grow px-4 py-3 rounded-xl bg-gray-50
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#1a8cd8]/20
              transition-all duration-200 resize-none text-[15px]
              scrollbar-thin scrollbar-thumb-gray-200"
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
            disabled={!newMessage.trim()}
            className="bg-[#1a8cd8] text-white px-5 py-2.5 rounded-full
              hover:bg-[#1a8cd8]/90 transition-colors duration-200
              text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </footer>

      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'font-sans',
          duration: 2000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0f1419',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
    </div>
  );
};