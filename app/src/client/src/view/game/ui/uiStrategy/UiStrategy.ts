import GameData from "@fieryvoid3/model/src/game/GameData";
import { Services } from "../../phase/PhaseDirector";
import { PhaseEventPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class UiStrategy {
  protected services: Services | null;
  protected gameData: GameData | null;

  constructor() {
    this.services = null;
    this.gameData = null;
  }

  deactivate() {}

  getServices() {
    if (!this.services) {
      throw new Error("Services not set");
    }

    return this.services;
  }

  getGameData() {
    if (!this.gameData) {
      throw new Error("Game data not set");
    }

    return this.gameData;
  }

  activate(services: Services) {
    this.services = services;
  }

  update(gameData: GameData) {
    this.gameData = gameData;
  }

  stopEvent(payload: PhaseEventPayload) {
    (payload as { stopped: boolean }).stopped = true;
  }
}

export default UiStrategy;
