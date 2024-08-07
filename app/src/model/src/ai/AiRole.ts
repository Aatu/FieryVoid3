export interface AiRole {
  playTurn(): void;
  serialize(): Record<string, unknown>;
  deserialize(): AiRole;
}
