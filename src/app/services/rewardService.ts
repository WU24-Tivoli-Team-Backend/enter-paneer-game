import { GAME_CONFIG } from "../config/gameConfig";

export interface RewardResult {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
}

type RewardType = "cash" | "stamp";

export async function processReward(
  jwtToken: string | null,
  rewardType: RewardType
): Promise<RewardResult> {
  if (!jwtToken) {
    return {
      success: false,
      error: "No JWT token available",
    };
  }

  try {
    const basePayload = {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
    };

    // Build payload based on reward type
    const transactionPayload =
      rewardType === "cash"
        ? {
            ...basePayload,
            payout_amount: 2.0, // 2€ cash reward
          }
        : {
            ...basePayload,
            payout_amount: 0.0, // No cash for stamp reward
            stamp_id: 1, // Use an appropriate stamp ID from your system
          };

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
        errorData.error || `Reward failed with status: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      message:
        rewardType === "cash"
          ? "Cash reward successful"
          : "Stamp reward successful",
      transactionId: data?.id || `mock-${Date.now()}`,
    };
  } catch (error) {
    console.error("Reward processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Reward failed",
    };
  }
}
