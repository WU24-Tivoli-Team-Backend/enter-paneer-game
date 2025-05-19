import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { processReward } from "../services/transactionService";

interface WinnerRewardsProps {
  onRewardClaimed: () => void;
}

const WinnerRewards: React.FC<WinnerRewardsProps> = ({ onRewardClaimed }) => {
  const { jwtToken } = useGameContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCashReward = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log(
        "Processing cash reward with token:",
        jwtToken ? "Token exists" : "No token"
      );
      const result = await processReward(jwtToken, "cash");

      if (result.success) {
        setSuccessMessage(`You received a €2 reward!`);
        onRewardClaimed();
      } else {
        setError(result.error || "Failed to process cash reward");
      }
    } catch (error) {
      console.error("Cash reward error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStampReward = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log(
        "Processing stamp reward with token:",
        jwtToken ? "Token exists" : "No token"
      );
      const result = await processReward(jwtToken, "stamp");

      if (result.success) {
        setSuccessMessage(`You received a new stamp for your collection!`);
        onRewardClaimed();
      } else {
        setError(result.error || "Failed to process stamp reward");
      }
    } catch (error) {
      console.error("Stamp reward error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (successMessage) {
    return (
      <div className="mt-8 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg w-full text-center">
        {successMessage}
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="text-2xl mb-4 text-center">Choose your reward:</h3>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={handleCashReward}
          disabled={isProcessing}
          className={`bg-[#e73413] text-white border-none rounded-2xl p-4 text-xl font-bold cursor-pointer transition-all hover:bg-[#d62800] hover:-translate-y-0.5 active:translate-y-0 ${
            isProcessing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Get €2 Cash"}
        </button>

        <button
          onClick={handleStampReward}
          disabled={isProcessing}
          className={`bg-[#f5b700] text-[#110d0a] border-none rounded-2xl p-4 text-xl font-bold cursor-pointer transition-all hover:bg-[#e5aa00] hover:-translate-y-0.5 active:translate-y-0 ${
            isProcessing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Get a Stamp"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default WinnerRewards;
