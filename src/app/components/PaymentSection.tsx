// src/app/components/PaymentSection.tsx
import React from "react";
import { useGameContext } from "./GameContext";
import { PaymentResponse } from "./types";
import { createPaneerTransaction } from "../services/transactionService";
import { GAME_CONFIG } from "../config/gameConfig";

const PaymentSection: React.FC = () => {
  const {
    setHasPaid,
    isProcessing,
    setIsProcessing,
    paymentError,
    setPaymentError,
    jwtToken,
    inputRef,
  } = useGameContext();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Skip real payment processing for now and focus on the transaction
      // This will be where you'd handle the actual payment if needed

      // For development purposes, simulate a successful payment
      const paymentData = {
        success: true,
        hasSufficientBalance: true,
      };

      // If payment was successful and we have a JWT token, create transaction
      if (paymentData.success && jwtToken) {
        try {
          // Get API key from environment
          const apiKey = process.env.NEXT_PUBLIC_API_KEY;

          if (!apiKey) {
            console.warn("No API key available in environment");
            // Still proceed since we're just testing
          }

          const transactionPayload = {
            // amusement_id: GAME_CONFIG.AMUSEMENT_ID, // Should be 11
            // stake_amount: GAME_CONFIG.COST, // Should be 2.0
            amusement_id: 11,
            stake_amount: 2.0,
          };

          console.log("Creating transaction with payload:", transactionPayload);

          // Create the transaction
          const transactionResponse = await createPaneerTransaction(
            jwtToken,
            apiKey || "", // Use empty string as fallback if not configured
            transactionPayload
          );

          console.log("Transaction created:", transactionResponse);
        } catch (transactionError) {
          console.error("Transaction creation failed:", transactionError);
          // Log the error but continue allowing gameplay for testing
        }
      }

      // Set game as paid and allow user to play
      setHasPaid(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Payment failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

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
    </div>
  );
};

export default PaymentSection;
