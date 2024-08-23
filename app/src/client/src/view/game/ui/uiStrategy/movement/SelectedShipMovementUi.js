import UiStrategy from "../UiStrategy";

class SelectedShipMovementUi extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }

  update(gameData) {
    super.update(gameData);
    this.shipStateChanged();
  }

  shipStateChanged() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();

    if (ship) {
      uiState.showShipMovement(ship, true);
    }
  }

  shipSelected(ship) {
    const { uiState } = this.getServices();
    uiState.showShipMovement(ship, true);
  }

  shipDeselected() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }
}

export default SelectedShipMovementUi;
