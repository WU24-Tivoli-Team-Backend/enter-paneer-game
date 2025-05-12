import type { NextApiRequest, NextApiResponse } from "next";
const jwt = require("jsonwebtoken");

interface DecodedToken {
  id: string;
  [key: string]: any;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
}

interface PaymentResponse {
  success: boolean;
  hasSufficientBalance: boolean;
  transactionId?: string;
  message?: string;
}

type ResponseData = PaymentResponse | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY") as DecodedToken;
    const body = req.body as PaymentRequest;

    const response = await fetch("https://yrgobanken.se/api/process_payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: body.currency,
        description: body.description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 402 || data.code === "INSUFFICIENT_BALANCE") {
        return res.status(200).json({
          success: false,
          hasSufficientBalance: false,
          message: "Insufficient balance for this purchase",
        });
      }

      return res
        .status(response.status)
        .json({ error: data.message || "Payment processing failed" });
    }

    return res.status(200).json({
      success: true,
      hasSufficientBalance: true,
      transactionId: data.transactionId,
      message: "Payment successful",
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
