import React from 'react';

export const Logo = ({ size = 'medium' }) => {
  // Size variants
  const sizes = {
    small: {
      container: 'h-8',
      letter: 'text-3xl',
      text: 'text-sm'
    },
    medium: {
      container: 'h-12',
      letter: 'text-4xl',
      text: 'text-base'
    },
    large: {
      container: 'h-16',
      letter: 'text-5xl',
      text: 'text-lg'
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* W Letter with gradient */}
      <div className={`${sizes[size].container} aspect-square flex items-center justify-center`}>
        <span 
          className={`${sizes[size].letter} font-bold font-['Freight_Disp_Pro'] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent`}
        >
          W
        </span>
      </div>
      {/* WebChat text */}
      <span className={`${sizes[size].text} text-gray-300 font-['Freight_Disp_Pro'] mt-1`}>
        WebChat
      </span>
    </div>
  );
};