import UiStrategy from "../UiStrategy";

class SelectedShipSystemList extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.setSystemList([]);
  }

  update(gameData) {
    const { uiState } = this.services;
    super.update(gameData);

    const ship = uiState.getSelectedShip();
    if (ship) {
      uiState.setSystemList(
        ship.systems.getSystems().filter(system => system.showOnSystemList())
      );
    }
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
