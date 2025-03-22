import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';

const ChatCalendar = ({ chatDates, onDateSelect, onClose, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [animationDirection, setAnimationDirection] = useState(0);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const hasChatOnDate = (date) => {
    if (!date) return false;
    return chatDates.some(chatDate => 
      new Date(chatDate * 1000).toDateString() === date.toDateString()
    );
  };

  const isSelectedDate = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const changeMonth = (increment) => {
    setAnimationDirection(increment);
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-[#f8f9fa]/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl 
          border border-white/20 w-[340px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-[#e9ecef] rounded-full transition-colors"
          >
            <IoChevronBack size={20} className="text-[#495057]" />
          </button>
          
          <h2 className="font-['SF Pro Display'] font-semibold text-[#212529]">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-[#e9ecef] rounded-full transition-colors"
          >
            <IoChevronForward size={20} className="text-[#495057]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {daysOfWeek.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[#6c757d] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
            initial={{ x: animationDirection * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -animationDirection * 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-1"
          >
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div
                key={index}
                onClick={() => date && hasChatOnDate(date) && onDateSelect(date)}
                className={`
                  relative h-10 flex items-center justify-center
                  ${date && hasChatOnDate(date) ? 'cursor-pointer hover:bg-[#e9ecef]' : ''}
                  ${isSelectedDate(date) ? 'bg-[#339af0] text-white' : ''}
                  rounded-full transition-all duration-200
                `}
              >
                {date && (
                  <>
                    <span className={`
                      text-sm
                      ${date.toDateString() === new Date().toDateString() && !isSelectedDate(date) 
                        ? 'text-[#339af0] font-semibold' 
                        : ''}
                      ${!isSelectedDate(date) ? 'text-[#495057]' : 'text-white'}
                    `}>
                      {date.getDate()}
                    </span>
                    {hasChatOnDate(date) && (
                      <div className={`
                        absolute bottom-1.5 w-1 h-1 
                        ${isSelectedDate(date) ? 'bg-white' : 'bg-[#339af0]'} 
                        rounded-full
                      `} />
                    )}
                  </>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ChatCalendar; 