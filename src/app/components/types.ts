export interface EncouragementMessage {
  text: string;
  visible: boolean;
}

export interface PaymentResponse {
  success: boolean;
  hasSufficientBalance: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
}

export type EncouragementGenerator = (text: string) => string;
