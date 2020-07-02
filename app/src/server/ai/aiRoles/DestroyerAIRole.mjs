import { getShipsThatShouldTargetOffensive } from "../analyzers/AiEWAnalyzer.mjs";

class DestroyerAIRole {
  constructor(ship) {
    this.ship = ship;
  }

  playTurn(gameData) {
    this.setEW(gameData);
  }

  setEW(gameData) {
    const targets = getShipsThatShouldTargetOffensive(this.ship, gameData);

    if (targets.length === 0) {
      return;
    }

    const mainEWIndex = Math.floor(Math.random() * targets.length);

    targets.forEach((target, index) => {
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
