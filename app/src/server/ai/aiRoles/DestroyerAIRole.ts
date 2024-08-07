import { getShipsThatShouldTargetOffensive } from "../analyzers/AiEWAnalyzer";
import Ship from "../../../model/src/unit/Ship";
import GameData from "../../../model/src/game/GameData";

class DestroyerAIRole {
  public ship: Ship;

  constructor(ship: Ship) {
    this.ship = ship;
  }

  playTurn(gameData: GameData) {
    this.setEW(gameData);
  }

  setEW(gameData: GameData) {
    const targets = getShipsThatShouldTargetOffensive(this.ship, gameData);

    if (targets.length === 0) {
      return;
    }

    const mainEWIndex = Math.floor(Math.random() * targets.length);

    targets.forEach((target: Ship, index: number) => {
      if (this.ship.electronicWarfare.canAssignOffensiveEw(target, 1)) {
        this.ship.electronicWarfare.assignOffensiveEw(target, 1);
      }

      if (index === mainEWIndex) {
        while (true) {
          if (!this.ship.electronicWarfare.canAssignOffensiveEw(target, 1)) {
            break;
          }

          this.ship.electronicWarfare.assignOffensiveEw(target, 1);
        }
      }
    });
  }

  serialize() {
    return {
      type: "DestroyerAiRole",
    };
  }

  deserialize() {
    return this;
  }
}

export default DestroyerAIRole;
