import { GameConfig } from "../components/types";

const GAME_NAME = process.env.GAME_NAME || "Enter_Paneer";

export const GAME_CONFIG: GameConfig = {
  AMUSEMENT_NAME: GAME_NAME,
  GROUP_ID: 8,
  COST: 2.0,
  STAMP_ID: 1,
};
