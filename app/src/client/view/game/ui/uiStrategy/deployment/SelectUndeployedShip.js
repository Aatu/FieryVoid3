import UiStrategy from "../UiStrategy";

class SelectUndeployedShip extends UiStrategy {
  update(gameData) {
    const { uiState, currentUser } = this.services;

    if (uiState.getSelectedShip()) {
      return;
    }

    const ships = gameData.getShipsForUser(currentUser);
    let ship = ships.find(s => s.movement.getDeployMove());

    if (!ship) {
      ship = ships[0];
    }

    if (!ship) {
      return;
    }

    uiState.selectShip(ship);
  }
}

export default SelectUndeployedShip;