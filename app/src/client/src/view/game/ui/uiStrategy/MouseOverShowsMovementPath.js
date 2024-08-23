import UiStrategy from "./UiStrategy";

class MouseOverShowsMovementPath extends UiStrategy {
  deactivate() {
    const { movementPathService } = this.getServices();
    movementPathService.hideAllMovementPaths();
  }

  mouseOverShip(payload) {
    const { movementPathService } = this.getServices();
    movementPathService.hideAllMovementPaths();
    movementPathService.showMovementPath(payload.entity.ship);
  }

  mouseOutShip() {
    const { movementPathService } = this.getServices();
    movementPathService.hideAllMovementPaths();
  }
}

export default MouseOverShowsMovementPath;
