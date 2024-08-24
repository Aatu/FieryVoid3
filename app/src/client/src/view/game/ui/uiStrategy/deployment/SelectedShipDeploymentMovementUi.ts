import Ship from "@fieryvoid3/model/src/unit/Ship";
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
      uiState.showShipDeploymentMovement(ship);
    }
  }

  shipSelected(ship: Ship) {
    const { uiState } = this.getServices();
    uiState.showShipDeploymentMovement(ship);
  }

  shipDeselected() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }
}

export default SelectedShipDeploymentMovementUi;
