import { GameConfig } from "../components/types";

const GAME_NAME = process.env.GAME_NAME || "Enter_Paneer";

const displayName = GAME_NAME.replace(/_/g, " ");

export const GAME_CONFIG: GameConfig = {
  AMUSEMENT_NAME: displayName,
  GROUP_ID: 8,
  COST: 2.0,
  STAMP_ID: 1,
};
