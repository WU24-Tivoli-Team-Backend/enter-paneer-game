import { GameConfig } from "../components/types";

export const GAME_CONFIG: GameConfig = {
  AMUSEMENT_ID: Number(process.env.AMUSEMENT_ID) || 5, // Default value, override with env if available
  GROUP_ID: 8,
  COST: 2.0,
  CURRENCY: "EUR",
  STAMP_ID: Number(process.env.STAMP_ID) || 13, // Default value, override with env if available
};

console.log("Game configuration:", GAME_CONFIG);
