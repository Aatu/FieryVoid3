import UiStrategy from "./UiStrategy";

class SelectFirstActiveShip extends UiStrategy {
  update(gameData) {
    const { uiState, currentUser } = this.services;

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
    }
  }
}

export default SelectFirstActiveShip;
