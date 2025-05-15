"use client";

import React, { useEffect } from "react";
import { GameProvider, useGameContext } from "./GameContext";
import JwtDisplay from "./JwtDisplay";
import PaymentSection from "./PaymentSection";
import PaneerInput from "./PaneerInput";
import WinnerScreen from "./WinnerScreen";

const GameContent: React.FC = () => {
  const { hasPaid, hasWon, typingTimerRef } = useGameContext();

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [typingTimerRef]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#fae6bb] text-[#110d0a] font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif] text-base">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-8xl font-bold mb-10 text-[#e73413] text-center">
          TYPE PANEER TO WIN
        </h1>

        {/* JWT Token Display Section */}
        <JwtDisplay />

        {!hasPaid ? (
          <PaymentSection />
        ) : !hasWon ? (
          <PaneerInput />
        ) : (
          <WinnerScreen />
        )}
      </div>
    </div>
  );
};

export default function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
