import UiStrategy from "./UiStrategy";
import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { GameUIMode } from "../gameUiModes";

class AllShipsMovementPaths extends UiStrategy {
  deactivate() {
    const { movementPathService } = this.getServices();
    movementPathService.hideAllMovementPaths();
  }

  update(gameData: GameData) {
    super.update(gameData);
    this.show();
  }

  uiStateChanged() {
    if (!this.gameData) {
      return;
    }

    this.show();
  }

  shipStateChanged({ ship }: { ship: Ship }) {
    const { movementPathService, uiState } = this.getServices();
    if (!this.gameData) {
      return;
    }

    if (
      !uiState.hasGameUiMode(GameUIMode.MOVEMENT) ||
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
    const { movementPathService, uiState } = this.getServices();

    if (uiState.hasGameUiMode(GameUIMode.MOVEMENT)) {
      const ships = this.getGameData().ships.getAliveShips();
      ships.forEach((ship) => movementPathService.showMovementPath(ship));
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
