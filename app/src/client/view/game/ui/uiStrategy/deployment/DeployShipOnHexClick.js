import UiStrategy from "../UiStrategy";

class DeployShipOnHexClick extends UiStrategy {
  hexClicked({ hex }) {
    const { uiState, movementService } = this.services;
    const ship = uiState.getSelectedShip();

    if (!ship || !this.gameData) {
      return;
    }

    const slot = this.gameData.slots.getSlotByShip(ship);

    if (!slot.isValidShipDeployment(ship, hex)) {
      return;
    }

    if (
      this.gameData.ships
        .getShips()
        .find(
          otherShip =>
            otherShip !== ship && otherShip.getHexPosition().equals(hex)
        )
    ) {
      return;
    }
    movementService.deploy(ship, hex);
    uiState.shipStateChanged(ship);
  }
}

export default DeployShipOnHexClick;
