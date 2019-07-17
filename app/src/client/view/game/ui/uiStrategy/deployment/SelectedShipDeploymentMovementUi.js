import UiStrategy from "../UiStrategy";

class SelectedShipDeploymentMovementUi extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.hideShipMovement();
  }

  shipStateChanged() {
    const { uiState } = this.services;
    const ship = uiState.getSelectedShip();

    if (ship) {
      uiState.showShipDeploymentMovement(ship, true);
    }
  }

  shipSelected(ship) {
    const { uiState } = this.services;
    uiState.showShipDeploymentMovement(ship, true);
  }

  shipDeselected() {
    const { uiState } = this.services;
    uiState.hideShipMovement();
  }
}

export default SelectedShipDeploymentMovementUi;
