import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  [key: string]: any;
}

type ResponseData = {
  userId?: string;
  authenticated?: boolean;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Extract token from headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token on server side
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY") as DecodedToken;

    // Send back user info to the client (but not the token itself)
    return res.status(200).json({
      userId: decoded.id,
      authenticated: true,
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
