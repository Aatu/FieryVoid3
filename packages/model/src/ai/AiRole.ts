import GameData from "../game/GameData";

export enum AI_ROLE {
  DESTROYER = "DestroyerAIRole",
}
export interface AiRole {
  playTurn(gameData: GameData): void;
  serialize(): Record<string, unknown>;
  deserialize(data: Record<string, unknown>): this;
  type: AI_ROLE;
}
