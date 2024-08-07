import Ship from "../unit/Ship";
import GameData from "./GameData";

class GameActiveShips {
  private gameData: GameData;
  public shipIds: string[];

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.shipIds = [];
  }

  isActive(ship: Ship) {
    return this.shipIds.includes(ship.getId());
  }

  setActive(ship: Ship) {
    if (this.isActive(ship)) {
      return;
    }

    this.shipIds.push(ship.getId());
  }

  setInactive(ship: Ship) {
    this.shipIds = this.shipIds.filter((id) => id !== ship.id);
  }

  serialize(): string[] {
    return this.shipIds;
  }

  deserialize(data: string[] = []) {
    this.shipIds = data;

    return this;
  }
}

export default GameActiveShips;
