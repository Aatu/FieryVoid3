import UiStrategy from "../UiStrategy";

class SelectedShipEwList extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.setEwList([]);
  }

  shipStateChanged() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }

  shipSelected(ship) {
    const { uiState } = this.getServices();
    if (!this.gameData) {
      return;
    }

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }
}

export default SelectedShipEwList;
