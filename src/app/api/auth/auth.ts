// import type { NextApiRequest, NextApiResponse } from "next";
// import { verifyToken, AuthResponse } from "../../utils/auth";

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<AuthResponse>
// ) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Missing or invalid token" });
//   }

//   const token = authHeader.split(" ")[1];

//   const authResponse = verifyToken(token, "YOUR_SECRET_KEY");

//   if (authResponse.authenticated) {
//     return res.status(200).json(authResponse);
//   } else {
//     return res.status(401).json(authResponse);
//   }
// }
