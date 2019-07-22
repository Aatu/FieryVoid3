import UiStrategy from "../UiStrategy";

class SelectedShipEwList extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.setEwList([]);
  }

  shipStateChanged() {
    const { uiState } = this.services;
    const ship = uiState.getSelectedShip();

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }

  shipSelected(ship) {
    const { uiState } = this.services;
    if (!this.gameData) {
      return;
    }

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }
}

export default SelectedShipEwList;
