import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import WinnerRewards from "./WinnerRewards";

const WinnerScreen: React.FC = () => {
  const { attempts, resetGame } = useGameContext();
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleRewardClaimed = () => {
    setRewardClaimed(true);
  };

  return (
    <div className="flex flex-col items-center w-full animate-[popIn_0.5s_ease-out]">
      <div className="bg-[#fef8ee] border-2 border-[#f0e0c9] rounded-2xl p-8 w-full">
        <h2 className="text-3xl mb-6 text-center">
          Congratulations! You typed paneer after {attempts}{" "}
          {attempts === 1 ? "attempt" : "attempts"}!
        </h2>
        <p className="text-2xl text-gray-500 leading-relaxed pt-6 border-t border-dashed border-[#e0d5c5]">
          Paneer is a fresh cheese common in South Asian cuisine. It&apos;s made
          by curdling milk with a fruit or vegetable acid like lemon juice.
        </p>
      </div>

      {!rewardClaimed && (
        <WinnerRewards onRewardClaimed={handleRewardClaimed} />
      )}

      <button
        onClick={resetGame}
        className="mt-8 bg-white text-[#e73413] border-2 border-[#e73413] rounded-2xl py-5 px-10 text-3xl font-bold cursor-pointer transition-all hover:bg-[rgba(231,52,19,0.05)]"
      >
        {rewardClaimed ? "Play Again" : "No reward, just play again"}
      </button>
    </div>
  );
};

export default WinnerScreen;
