import UiStrategy from "./UiStrategy";

class SelectFirstActiveShip extends UiStrategy {
  async update(gameData) {
    const { uiState, currentUser, gameCamera, shipIconContainer } =
      this.getServices();

    if (
      uiState.getSelectedShip() &&
      gameData.activeShips.isActive(uiState.getSelectedShip())
    ) {
      const oldShip = uiState.getSelectedShip();
      const newShip = gameData.ships.getShipById(oldShip.id);
      if (oldShip !== newShip) {
        uiState.selectShip(newShip);
      }
      return;
    }

    const ship = gameData.getActiveShipsForUser(currentUser).pop();

    if (ship) {
      uiState.selectShip(ship);
      await shipIconContainer.shipsLoaded();
      const icon = shipIconContainer.getByShip(ship);
      gameCamera.setByLookAtPosition(icon.getPosition());
    }
  }
}

export default SelectFirstActiveShip;
