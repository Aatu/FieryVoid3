import GameData from "@fieryvoid3/model/src/game/GameData";
import PhaseStrategy, { PhaseEventPayload } from "./PhaseStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class LobbyPhaseStrategy extends PhaseStrategy {
  update(gamedata: GameData) {
    super.update(gamedata);
    const { uiState } = this.services;
    uiState.setLobby(true);

    return this;
  }

  onEvent(name: string, payload: PhaseEventPayload = {}) {
    switch (name) {
      case "takeSlot":
        return this.services.gameConnector.takeSlot(
          (payload as { id: string }).id
        );
      case "leaveSlot":
        return this.services.gameConnector.leaveSlot(
          (payload as { id: string }).id
        );
      case "buyShips":
        return this.services.gameConnector.buyShips(
          (payload as { slot: { id: string } }).slot.id,
          (payload as { ships: Ship[] }).ships
        );
      default:
        return super.onEvent(name, payload);
    }
  }

  deactivate() {
    super.deactivate();
    const { uiState } = this.services;
    uiState.setLobby(false);

    return this;
  }
}

export default LobbyPhaseStrategy;
