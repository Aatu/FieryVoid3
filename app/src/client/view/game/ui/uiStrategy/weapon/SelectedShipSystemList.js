import UiStrategy from "../UiStrategy";

class SelectedShipSystemList extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.setSystemList([]);
  }

  shipSelected(ship) {
    const { uiState } = this.services;
    if (!this.gameData) {
      return;
    }

    uiState.setSystemList(
      ship.systems.getSystems().filter(system => system.showOnSystemList())
    );
  }
}

export default SelectedShipSystemList;
