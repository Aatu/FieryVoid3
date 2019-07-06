import UiStrategy from "./UiStrategy";

class MouseOverShowsMovementPath extends UiStrategy {
  deactivate() {
    const { movementPathService } = this.services;
    movementPathService.hideAllMovementPaths();
  }

  mouseOverShip(payload) {
    const { movementPathService } = this.services;
    movementPathService.hideAllMovementPaths();
    movementPathService.showMovementPath(payload.entity.ship);
  }

  mouseOutShip() {
    const { movementPathService } = this.services;
    movementPathService.hideAllMovementPaths();
  }
}

export default MouseOverShowsMovementPath;
