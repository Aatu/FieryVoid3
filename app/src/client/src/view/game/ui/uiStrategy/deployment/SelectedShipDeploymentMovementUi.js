import UiStrategy from "../UiStrategy";

class SelectedShipDeploymentMovementUi extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }

  shipStateChanged() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();

    if (ship) {
      uiState.showShipDeploymentMovement(ship, true);
    }
  }

  shipSelected(ship) {
    const { uiState } = this.getServices();
    uiState.showShipDeploymentMovement(ship, true);
  }

  shipDeselected() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }
}

export default SelectedShipDeploymentMovementUi;
