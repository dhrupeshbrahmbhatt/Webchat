import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineChatBubbleOutline, MdOutlinePhone } from "react-icons/md";
import { Message } from '../Components/Message';
import { Toaster, toast } from "react-hot-toast";

export const Home = () => {
  const token = document.cookie;

  const check_Auth = async () => {
    try {
      const req = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: "Bearer " + token.split('=')[1],
          'Content-Type': 'application/json',
        }
      });
      toast.success("Welcome Back!")
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

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Toaster position="top-center" reverseOrder={false}/>
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
        <Message />
      </div>
    </div>
  );
};
