import React from "react";
import { useGameContext } from "./GameContext";

const EncouragementBubble: React.FC = () => {
  const { encouragement } = useGameContext();

  if (!encouragement.text) return null;

  return (
    <div
      className={`absolute -top-28 left-0 right-0 text-center p-6 bg-white text-[#110d0a] border-2 border-[#f0e0c9] rounded-2xl transition-all duration-300 shadow-md z-10 ${
        encouragement.visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="font-medium text-base">{encouragement.text}</span>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-white border-l-transparent border-r-transparent drop-shadow-sm"></div>
    </div>
  );
};

export default EncouragementBubble;
