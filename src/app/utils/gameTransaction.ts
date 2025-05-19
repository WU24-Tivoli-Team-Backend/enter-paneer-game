import { createTransaction } from "../services/transactionService";
import { GAME_CONFIG } from "../config/gameConfig";
import { TransactionResponse } from "../types/transactions";

export async function makePayment(
  token: string | null
): Promise<TransactionResponse> {
  return createTransaction(
    {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
      stake_amount: GAME_CONFIG.COST,
    },
    token
  );
}

export async function giveStampReward(
  token: string | null
): Promise<TransactionResponse> {
  return createTransaction(
    {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
      payout_amount: 0.1, // Small amount required for stamp transactions
      stamp_id: GAME_CONFIG.STAMP_ID,
    },
    token
  );
}

export async function giveCashReward(
  token: string | null,
  amount: number = 2.0
): Promise<TransactionResponse> {
  return createTransaction(
    {
      amusement_id: GAME_CONFIG.AMUSEMENT_ID,
      payout_amount: amount,
    },
    token
  );
}
