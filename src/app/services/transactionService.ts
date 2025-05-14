interface TransactionPayload {
  amusement_id: number;
  stake_amount: number;
}

/**
 * Create a transaction for the Paneer game purchase
 * @param token JWT token for authorization
 * @param apiKey Group API key
 * @param payload Transaction data
 */
export async function createPaneerTransaction(
  token: string,
  apiKey: string,
  payload: TransactionPayload
): Promise<any> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  try {
    const response = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response) {
      throw new Error("No response from transaction API");
    }

    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from transaction API");
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Transaction failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Transaction creation error:", error);
    throw error;
  }
}
