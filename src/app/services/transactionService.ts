import { TransactionPayload, TransactionResponse } from "../types/transactions";

export async function createTransaction(
  payload: TransactionPayload,
  token: string | null
): Promise<TransactionResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

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
