import MovementPath from "./MovementPath";

class MovementPathService {
  constructor(scene, shipIconContainer) {
    this.scene = scene;
    this.shipIconContainer = shipIconContainer;
    this.terrain = null;

    this.paths = [];
  }

  getPath(ship) {
    return this.paths.find(path => path.ship === ship);
  }

  update(gameData) {
    this.terrain = gameData.terrain;
  }

  hideAllMovementPaths() {
    this.paths.forEach(path => path.movementPath.remove(this.scene));
    this.paths = [];
  }

  hideMovementPath(ship) {
    const path = this.getPath(ship);
    if (!path) {
      return;
    }

    path.movementPath.remove(this.scene);
    this.paths = this.paths.filter(path => path.ship !== ship);
  }

  showMovementPath(ship) {
    let path = this.getPath(ship);

    if (!path) {
      path = {
        ship,
        ghost: this.shipIconContainer.getGhostShipIconByShip(ship),
        movementPath: null
      };
      this.paths.push(path);
    }

    if (path.movementPath) {
      path.movementPath.remove(this.scene);
    }

    //console.log(this.shipIconContainer.getByShip(ship).clone());

    path.movementPath = new MovementPath(
      ship,
      this.scene,
      this.terrain,
      path.ghost
    );
  }
}

export default MovementPathService;
