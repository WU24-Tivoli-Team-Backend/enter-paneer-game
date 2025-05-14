// src/app/components/TransactionDebug.tsx
import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { createPaneerTransaction } from "../services/transactionService";
import { GAME_CONFIG } from "../config/gameConfig";

const TransactionDebug: React.FC = () => {
  const { jwtToken } = useGameContext();
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  const testTransaction = async () => {
    setIsLoading(true);
    setResult("");
    setError("");

    try {
      if (!jwtToken) {
        throw new Error("No JWT token available");
      }

      const transactionPayload = {
        amusement_id: GAME_CONFIG.AMUSEMENT_ID,
        stake_amount: GAME_CONFIG.COST,
      };

      console.log("Testing transaction with:", {
        apiKey: apiKey ? "Available" : "Not available",
        jwtToken: jwtToken ? "Available" : "Not available",
        payload: transactionPayload,
      });

      const response = await createPaneerTransaction(
        jwtToken,
        apiKey,
        transactionPayload
      );

      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      console.error("Test transaction failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
      <h3 className="font-bold mb-2">Transaction Debug Tool</h3>

      <div className="mb-4">
        <button
          onClick={testTransaction}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isLoading ? "Testing..." : "Test Transaction"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg overflow-auto">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg overflow-auto">
          <p className="font-bold">Result:</p>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        <p>JWT Token: {jwtToken ? "Available" : "Not available"}</p>
        <p>API Key: {apiKey ? "Available" : "Not available"}</p>
        <p>Amusement ID: {GAME_CONFIG.AMUSEMENT_ID}</p>
      </div>
    </div>
  );
};

export default TransactionDebug;
