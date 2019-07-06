import UiStrategy from "./UiStrategy";

class AllShipsMovementPaths extends UiStrategy {
  deactivate() {
    const { movementPathService } = this.services;
    movementPathService.hideAllMovementPaths();
  }

  update(gameData) {
    const { movementPathService } = this.services;
    super.update(gameData);

    const ships = gameData.ships.getAliveShips();
    ships.forEach(ship => movementPathService.showMovementPath(ship));
  }

  shipMovementChanged(ship) {
    const { movementPathService } = this.services;
    if (!this.gameData) {
      return;
    }

    movementPathService.showMovementPath(ship);
  }
}

export default AllShipsMovementPaths;
