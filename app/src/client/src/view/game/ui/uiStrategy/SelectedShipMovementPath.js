import UiStrategy from "./UiStrategy";

const hideAllMovementPaths = (shipIconContainer) => {
  shipIconContainer.getArray().forEach(function (icon) {
    icon.hideMovementPath();
  });
};

class SelectedShipMovementPath extends UiStrategy {
  deactivate() {
    const { shipIconContainer } = this.getServices();
    hideAllMovementPaths(shipIconContainer);
  }

  update(gameData) {
    const { uiState } = this.getServices();
    super.update(gameData);

    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipStateChanged(ship);
    }
  }

  shipStateChanged(ship) {
    const { shipIconContainer, uiState } = this.getServices();

    if (uiState.getSelectedShip() !== ship || !this.gameData) {
      return;
    }

    hideAllMovementPaths(shipIconContainer);
    shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  shipSelected(ship) {
    const { shipIconContainer } = this.getServices();
    if (!this.gameData) {
      return;
    }

    hideAllMovementPaths(shipIconContainer);
    shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  mouseOutShip(payload) {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipStateChanged(ship);
    }
  }

  shipDeselected() {
    const { shipIconContainer } = this.getServices();
    hideAllMovementPaths(shipIconContainer);
  }
}

export default SelectedShipMovementPath;
