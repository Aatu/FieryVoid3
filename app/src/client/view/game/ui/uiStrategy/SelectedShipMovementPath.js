import UiStrategy from "./UiStrategy";

const hideAllMovementPaths = shipIconContainer => {
  shipIconContainer.getArray().forEach(function(icon) {
    icon.hideMovementPath();
  });
};

class SelectedShipMovementPath extends UiStrategy {
  deactivate() {
    const { shipIconContainer } = this.services;
    hideAllMovementPaths(shipIconContainer);
  }

  update(gameData) {
    const { uiState } = this.services;
    super.update(gameData);

    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipMovementChanged(ship);
    }
  }

  shipMovementChanged(ship) {
    const { shipIconContainer, uiState } = this.services;

    if (uiState.getSelectedShip() !== ship || !this.gameData) {
      return;
    }

    hideAllMovementPaths(shipIconContainer);
    shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  shipSelected(ship) {
    const { shipIconContainer } = this.services;
    if (!this.gameData) {
      return;
    }

    hideAllMovementPaths(shipIconContainer);
    shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  mouseOutShip(payload) {
    const { uiState } = this.services;
    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipMovementChanged(ship);
    }

    console.log("mouseOutShip selected", ship);
  }

  shipDeselected() {
    const { shipIconContainer } = this.services;
    hideAllMovementPaths(shipIconContainer);
  }
}

export default SelectedShipMovementPath;
