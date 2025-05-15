import { createPaneerTransaction } from "./transactionService";
import { GAME_CONFIG } from "../config/gameConfig";

export interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
}

/**
 * Processes a payment and creates a transaction for the Paneer game
 * Centralizes payment logic that was previously duplicated across components
 */
export async function processPayment(
  jwtToken: string | null
): Promise<PaymentResult> {
  if (!jwtToken) {
    return {
      success: false,
      error: "No JWT token available",
    };
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

    const transactionPayload = {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
      stake_amount: GAME_CONFIG.COST,
    };

    console.log("Creating transaction with payload:", transactionPayload);

    const transactionResponse = await createPaneerTransaction(
      jwtToken,
      apiKey,
      transactionPayload
    );

    console.log("Transaction created:", transactionResponse);

    return {
      success: true,
      message: "Payment successful",
      transactionId: transactionResponse?.id || `mock-${Date.now()}`,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}
