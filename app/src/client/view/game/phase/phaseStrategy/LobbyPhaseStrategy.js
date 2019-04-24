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
    if (name === "takeSlot") {
      console.log("I would like to take the slot");
    } else {
      super.onEvent(name, payload);
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
