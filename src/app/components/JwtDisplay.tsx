import { useEffect } from "react";
import { useGameContext } from "./GameContext";
import { decodeJwt } from "../utils/auth";

/**
 * Component to receive JWT token from parent application
 * Handles authentication logic but renders nothing visible to the user
 */
export default function JwtDisplay() {
  const { setJwtToken } = useGameContext();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "https://tivoli.yrgobanken.vip",
          "https://yrgobanken.vip",
        ];

        if (!allowedOrigins.includes(event.origin)) {
          console.log(
            `Ignoring message from unauthorized origin: ${event.origin}`
          );
          return;
        }

        if (event.data && event.data.type === "JWT_TOKEN") {
          const { token } = event.data;

          setJwtToken(token);

          // Decode token for validation but don't store it
          const decoded = decodeJwt(token);
          if (!decoded) {
            console.error("Failed to decode token");
          }

          console.log("Received JWT token from parent application");
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    };

    window.addEventListener("message", handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: "GAME_READY" }, "*");
      console.log("Game ready message sent to parent");
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setJwtToken]);

  // Component handles authentication but renders nothing visible
  // All JWT functionality is preserved but hidden from the user
  return null;
}
