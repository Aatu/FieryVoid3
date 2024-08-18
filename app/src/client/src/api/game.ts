import GameData from "@fieryvoid3/model/src/game/GameData";
import { api } from "./api";

export const createGame = async (gameData: GameData) =>
  api.post("/game", gameData.serialize());

export const createTestGame = async (payload: Record<string, unknown> = {}) =>
  api.post("/testGame", payload);
