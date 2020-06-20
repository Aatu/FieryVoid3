import MovementPath from "./MovementPath";

class MovementPathService {
  constructor(scene, shipIconContainer, currentUser) {
    this.scene = scene;
    this.shipIconContainer = shipIconContainer;
    this.terrain = null;
    this.currentUser = currentUser;

    this.paths = [];
  }

  getPath(ship) {
    return this.paths.find((path) => path.ship.id === ship.id);
  }

  update(gameData) {
    this.terrain = gameData.terrain;
  }

  hideAllMovementPaths() {
    this.paths.forEach((path) => path.movementPath.remove(this.scene));
    this.paths = [];
  }

  hideMovementPath(ship) {
    const path = this.getPath(ship);
    if (!path) {
      return;
    }

    path.movementPath.remove(this.scene);
    this.paths = this.paths.filter((path) => path.ship !== ship);
  }

  showMovementPath(ship) {
    let path = this.getPath(ship);

    if (!path) {
      path = {
        ship,
        ghost: this.shipIconContainer.getGhostShipIconByShip(ship),
        movementPath: null,
      };
      this.paths.push(path);
    }

    if (path.movementPath) {
      //TODO: this is inefficient and causes flickering
      path.movementPath.remove(this.scene);
    }

    path.ship = ship;

    path.movementPath = new MovementPath(
      ship,
      this.scene,
      this.terrain,
      path.ghost,
      ship.player.is(this.currentUser)
    );
  }
}

export default MovementPathService;
