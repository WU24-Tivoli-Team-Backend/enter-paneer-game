import { GAME_CONFIG } from "../config/gameConfig";

export interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
}

/**
 * Processes a payment and creates a transaction for the Paneer game
 * Using server-side API route to keep API key secure
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
    const transactionPayload = {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
      stake_amount: GAME_CONFIG.COST,
    };

    console.log("Creating transaction with payload:", transactionPayload);

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Payment failed with status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Transaction created:", data);

    return {
      success: true,
      message: "Payment successful",
      transactionId: data?.id || `mock-${Date.now()}`,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}
