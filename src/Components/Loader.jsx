import React from "react";
import { Logo } from "../../public/W(1).png";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-accent-darkBackground">
      <div className="w-46 h-46 flex items-center justify-center rounded-full border-4 border-accent-brownLight animate-pulse">
        <img
          src="../../public/W(1).png" // Image path handled by Vite
          alt="Logo"
          className="h-40 w-40 object-contain rounded-full bg-white" // animate-fade-in-scale removed for simplicity, unless needed
        />
      </div>
    </div>
  );
};
