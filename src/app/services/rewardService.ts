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
  rewardType: RewardType,
  amusementId: number | undefined
): Promise<RewardResult> {
  if (!jwtToken) {
    return {
      success: false,
      error: "No JWT token available",
    };
  }

  if (amusementId === undefined) {
    return {
      success: false,
      error: "Amusement ID not available. Please try again later.",
    };
  }

  try {
    let transactionPayload;

    if (rewardType === "cash") {
      transactionPayload = {
        amusement_id: amusementId,
        payout_amount: 2.0,
      };
    } else {
      // For stamp rewards, we need to provide a payout_amount
      // since stamps can only be awarded with payouts
      transactionPayload = {
        amusement_id: amusementId,
        payout_amount: 0.1,
        stamp_id: GAME_CONFIG.STAMP_ID,
      };
    }

    console.log("Sending transaction payload:", transactionPayload);

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    // Parse the response to handle errors better
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log("Non-JSON response:", text);
      data = { message: text };
    }

    if (!response.ok) {
      let errorMessage = "Reward failed";

      if (data) {
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          errorMessage = JSON.stringify(data.errors);
        }
      }

      throw new Error(errorMessage);
    }

    return {
      success: true,
      message:
        rewardType === "cash"
          ? "You received a 2€ reward!"
          : "You received a new stamp for your collection!",
      transactionId: data?.transaction?.id || data?.id || `mock-${Date.now()}`,
    };
  } catch (error) {
    console.error("Reward processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Reward failed",
    };
  }
}
