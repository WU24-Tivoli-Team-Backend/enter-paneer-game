/**
 * This file is kept for reference but its functionality has been moved to the server-side
 * API route in /api/transactions/route.ts
 *
 * The direct API calls with API keys are now handled server-side to improve security.
 */

// This interface is still useful and can be exported
export interface TransactionPayload {
  amusement_id: number;
  stake_amount: number;
}
