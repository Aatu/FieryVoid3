import PhaseStrategy from "./PhaseStrategy";

class LobbyPhaseStrategy extends PhaseStrategy {
  update(gamedata) {
    super.update(gamedata);
    const { uiState } = this.services;
    uiState.setLobby(true);
    uiState.setGameData(gamedata);

    return this;
  }

  onEvent(name, payload) {
    switch (name) {
      case "takeSlot":
        return this.services.gameConnector.takeSlot(payload.id);
      case "leaveSlot":
        return this.services.gameConnector.leaveSlot(payload.id);
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
