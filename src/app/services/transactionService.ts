import { GAME_CONFIG } from "../config/gameConfig";

export interface TransactionResult {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
}

export type TransactionType = "payment" | "cash_reward" | "stamp_reward";

export interface TransactionPayload {
  amusement_id: number;
  stake_amount?: number;
  payout_amount?: number;
  stamp_id?: number;
}

export interface TransactionResponse {
  success: boolean;
  transaction_id?: string;
  message?: string;
  error?: string;
}

// This is the main function that handles all transaction types
export async function processTransaction(
  jwtToken: string | null,
  type: TransactionType
): Promise<TransactionResult> {
  if (!jwtToken) {
    return {
      success: false,
      error: "No JWT token available",
    };
  }

  try {
    let transactionPayload;
    let successMessage;

    switch (type) {
      case "payment":
        transactionPayload = {
          amusement_id: GAME_CONFIG.AMUSEMENT_ID,
          stake_amount: GAME_CONFIG.COST,
        };
        successMessage = "Payment successful";
        break;
      case "cash_reward":
        transactionPayload = {
          amusement_id: GAME_CONFIG.AMUSEMENT_ID,
          payout_amount: 2.0,
        };
        successMessage = "You received a €2 reward!";
        break;
      case "stamp_reward":
        transactionPayload = {
          amusement_id: GAME_CONFIG.AMUSEMENT_ID,
          payout_amount: 0.1, // Small amount required for stamp transactions
          stamp_id: GAME_CONFIG.STAMP_ID,
        };
        successMessage = "You received a new stamp for your collection!";
        break;
      default:
        return {
          success: false,
          error: "Invalid transaction type",
        };
    }

    // Use the generic createTransaction function
    const result = await createTransaction(transactionPayload, jwtToken);

    return {
      success: result.success,
      message: successMessage,
      transactionId: result.transaction_id || `tx-${Date.now()}`,
      error: result.error,
    };
  } catch (error) {
    console.error(`${type} processing error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `${type} failed`,
    };
  }
}

// Generic function to create any transaction with a custom payload
export async function createTransaction(
  payload: TransactionPayload,
  token: string | null
): Promise<TransactionResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    console.log("Creating transaction with payload:", payload);

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Transaction failed: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
}

// Convenience functions for specific transaction types
export function processPayment(
  jwtToken: string | null
): Promise<TransactionResult> {
  return processTransaction(jwtToken, "payment");
}

export function processCashReward(
  jwtToken: string | null
): Promise<TransactionResult> {
  return processTransaction(jwtToken, "cash_reward");
}

export function processStampReward(
  jwtToken: string | null
): Promise<TransactionResult> {
  return processTransaction(jwtToken, "stamp_reward");
}

export function processReward(
  jwtToken: string | null,
  rewardType: "cash" | "stamp"
): Promise<TransactionResult> {
  return processTransaction(
    jwtToken,
    rewardType === "cash" ? "cash_reward" : "stamp_reward"
  );
}
