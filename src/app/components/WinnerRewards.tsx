import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { processReward } from "./../services/rewardService";

interface WinnerRewardsProps {
  onRewardClaimed: () => void;
}

const WinnerRewards: React.FC<WinnerRewardsProps> = ({ onRewardClaimed }) => {
  const { jwtToken, amusementId, amusementError, retryAmusementLookup } =
    useGameContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCashReward = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processReward(jwtToken, "cash", amusementId);

      if (result.success) {
        setSuccessMessage(`You received a 2€ reward!`);
        onRewardClaimed();
      } else {
        setError(result.error || "Failed to process cash reward");
      }
    } catch (error) {
      console.error("Reward error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process reward"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStampReward = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processReward(jwtToken, "stamp", amusementId);

      if (result.success) {
        setSuccessMessage(`You received a new stamp for your collection!`);
        onRewardClaimed();
      } else {
        setError(result.error || "Failed to process stamp reward");
      }
    } catch (error) {
      console.error("Reward error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process reward"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // If there was an error with the amusement ID lookup, show retry option
  if (amusementError) {
    return (
      <div className="mt-8 w-full">
        <div className="p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg text-center mb-4">
          <p className="mb-2">
            Unable to process rewards due to a connection error.
          </p>
          <p className="text-sm">{amusementError}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={retryAmusementLookup}
            className="bg-[#e73413] text-white border-none rounded-2xl p-3 text-lg font-bold cursor-pointer transition-all hover:bg-[#d62800]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // In development, we'll show which amusement ID we're using
  const devInfo = process.env.NODE_ENV === "development" && (
    <div className="mt-2 text-xs text-gray-500 text-center">
      Using amusement ID: {amusementId}
    </div>
  );

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Choose Your Reward
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCashReward}
          disabled={isProcessing || successMessage !== null}
          className={`bg-[#e73413] text-white border-none rounded-2xl p-5 text-xl font-bold cursor-pointer transition-all hover:bg-[#d62800] hover:-translate-y-0.5 active:translate-y-0 ${
            isProcessing || successMessage
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Claim 2€ Reward"}
        </button>

        <button
          onClick={handleStampReward}
          disabled={isProcessing || successMessage !== null}
          className={`bg-[#4f46e5] text-white border-none rounded-2xl p-5 text-xl font-bold cursor-pointer transition-all hover:bg-[#4338ca] hover:-translate-y-0.5 active:translate-y-0 ${
            isProcessing || successMessage
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Claim Stamp"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg text-center">
          {successMessage}
        </div>
      )}

      {devInfo}
    </div>
  );
};

export default WinnerRewards;
