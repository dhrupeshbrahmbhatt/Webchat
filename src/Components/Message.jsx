import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageBox from "../Components/MessageTemplate";
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

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

export const Message = ({ selectedContact, onClose }) => {
  const [post, setPost] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [newMessage, setNewMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const token = document.cookie;
  const symmetricKey = sessionStorage.getItem('symmetric_key');
  const [isTyping, setIsTyping] = useState(false);

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

  let prevScrollHeight = 0;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchMessages = async (pageNum) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/posts`, {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        // Process encrypted messages
        const decryptedMessages = response.data
          .filter(msg => msg.content?.body && msg.content?.isEncrypted)
          .map(msg => {
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
            } catch (error) {
              console.error('Failed to decrypt message:', error);
              return msg;
            }
          });

        // Add unencrypted messages
        const unencryptedMessages = response.data
          .filter(msg => msg.content?.body && !msg.content?.isEncrypted)
          .map(msg => ({
            ...msg,
            content: {
              body: msg.content.body,
              isEncrypted: false
            }
          }));

        // Combine messages, remove duplicates, and reverse the order
        const allMessages = [...decryptedMessages, ...unencryptedMessages];
        const uniqueMessages = allMessages.reduce((acc, current) => {
          const isDuplicate = acc.find(item => 
            item.time === current.time && 
            item.content.body === current.content.body
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []).reverse();

        setPost(prevPosts => {
          const combinedPosts = [...prevPosts, ...uniqueMessages];
          const finalPosts = combinedPosts.reduce((acc, current) => {
            const isDuplicate = acc.find(item => 
              item.time === current.time && 
              item.content.body === current.content.body
            );
            if (!isDuplicate) {
              acc.push(current);
            }
            return acc;
          }, []);

          // Scroll to bottom after setting posts
          setTimeout(scrollToBottom, 100);
          return finalPosts;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchMessages(page);

    const chatContainer = chatContainerRef.current;
    chatContainer.addEventListener('scroll', handleScroll);

    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

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
          animation: true // Add animation flag
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
      
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
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
    if (post.length > 0) {
      scrollToBottom();
    }
  }, []);

  useEffect(() => {
    if (newMessage === '') {
      setIsTyping(false);
    }
  }, [newMessage]);

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
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-300">
          <IoClose size={24} />
        </button>
      </header>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-white/5 hover:scrollbar-thumb-purple-500/50 transition-colors duration-300"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {loading && page === 1 && (
          <div className="text-center py-4 text-gray-400">Loading...</div>
        )}
        {post.length > 0 && (
          <div className="px-6 py-4">
            {post
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

                const isMyMessage = item.sender === userAddress;
                acc.push(
                  <motion.div
                    key={`msg-${item.time}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <MessageBox
                      isMyMessage={isMyMessage}
                      Message={item.content.body}
                      Address={item.sender}
                      isEncrypted={item.content.isEncrypted}
                      timestamp={item.time}
                    />
                  </motion.div>
                );

                return acc;
              }, [])}
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