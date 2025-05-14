// src/components/game/PaymentSection.tsx
import React from "react";
import { useGameContext } from "./GameContext";
import { PaymentResponse } from "./types";

const PaymentSection: React.FC = () => {
  const {
    setHasPaid,
    isProcessing,
    setIsProcessing,
    paymentError,
    setPaymentError,
    inputRef,
  } = useGameContext();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2.0,
          currency: "EUR",
          description: "Paneer Game Access",
        }),
        credentials: "include",
      });

      const data: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment processing failed");
      }

      if (!data.hasSufficientBalance) {
        setPaymentError("Insufficient balance for this purchase");
        return;
      }

      if (data.success) {
        setHasPaid(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        setPaymentError(data.message || "Payment was not successful");
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

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`bg-[#e73413] text-white border-none rounded-2xl p-6 text-3xl font-bold cursor-pointer transition-all hover:bg-[#d62800] hover:-translate-y-0.5 active:translate-y-0 ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Play! Cost: 2€"}
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
