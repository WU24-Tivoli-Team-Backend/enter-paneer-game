import React from "react";
import { useGameContext } from "./GameContext";
import { GAME_CONFIG } from "../config/gameConfig";
import { processPayment } from "../services/paymentService";

const PaymentSection: React.FC = () => {
  const {
    setHasPaid,
    isProcessing,
    setIsProcessing,
    paymentError,
    setPaymentError,
    jwtToken,
    inputRef,
    amusementId,
    isAmusementLoading,
    amusementError,
    retryAmusementLookup,
  } = useGameContext();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const result = await processPayment(jwtToken, amusementId);

      if (result.success) {
        setHasPaid(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        setPaymentError(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Payment failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state if amusement ID lookup is in progress
  if (isAmusementLoading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-yellow-700">Initializing game...</p>
        </div>
      </div>
    );
  }

  // Show error if amusement ID lookup failed, with retry button
  if (amusementError) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Game initialization error</h3>
          <p>{amusementError}</p>
          <p className="mt-2 text-sm">
            This might be a temporary issue with the game servers.
          </p>
        </div>
        <button
          onClick={retryAmusementLookup}
          className="bg-[#e73413] text-white border-none rounded-2xl p-3 text-lg font-bold cursor-pointer transition-all hover:bg-[#d62800]"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // In development, we'll show which amusement ID we're using
  const devInfo = process.env.NODE_ENV === "development" && (
    <div className="mt-2 text-xs text-gray-500">
      Using amusement ID: {amusementId}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`bg-[#e73413] text-white border-none rounded-2xl p-6 text-3xl font-bold cursor-pointer transition-all hover:bg-[#d62800] hover:-translate-y-0.5 active:translate-y-0 ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing..." : `Play! Cost: ${GAME_CONFIG.COST}€`}
      </button>
      {paymentError && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
          {paymentError}
        </div>
      )}
      {devInfo}
    </div>
  );
};

export default PaymentSection;
