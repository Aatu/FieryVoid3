import UiStrategy from "./UiStrategy";
import * as gameUiModes from "../gameUiModes";

class AllShipsMovementPaths extends UiStrategy {
  deactivate() {
    const { movementPathService } = this.services;
    movementPathService.hideAllMovementPaths();
  }

  update(gameData) {
    super.update(gameData);
    this.show();
  }

  uiStateChanged() {
    if (!this.gameData) {
      return;
    }

    this.show();
  }

  shipStateChanged(ship) {
    const { movementPathService, uiState } = this.services;
    if (!this.gameData) {
      return;
    }

    if (
      !uiState.hasGameUiMode(gameUiModes.MOVEMENT) ||
      uiState.getSelectedShip() !== ship
    ) {
      return;
    }

    movementPathService.showMovementPath(ship);
  }

  mouseOutShip() {
    this.show();
  }

  show() {
    const { movementPathService, uiState } = this.services;

    if (uiState.hasGameUiMode(gameUiModes.MOVEMENT)) {
      const ships = this.gameData.ships.getAliveShips();
      ships.forEach(ship => movementPathService.showMovementPath(ship));
    } else {
      movementPathService.hideAllMovementPaths();

      /*
      const ship = uiState.getSelectedShip();
      if (ship) {
        movementPathService.showMovementPath(ship);
      }
      */
    }
  }
}

export default AllShipsMovementPaths;
