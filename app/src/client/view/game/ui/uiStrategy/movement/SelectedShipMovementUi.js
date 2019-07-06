import UiStrategy from "../UiStrategy";

class SelectedShipMovementUi extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.hideShipMovement();
  }

  shipMovementChanged() {
    const { uiState } = this.services;
    const ship = uiState.getSelectedShip();

    if (ship) {
      uiState.showShipMovement(ship, true);
    }
  }

  shipSelected(ship) {
    const { uiState } = this.services;
    uiState.showShipMovement(ship, true);
  }

  shipDeselected() {
    const { uiState } = this.services;
    uiState.hideShipMovement();
  }
}

export default SelectedShipMovementUi;
