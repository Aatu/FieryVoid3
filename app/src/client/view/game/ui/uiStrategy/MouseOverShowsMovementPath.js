import UiStrategy from "./UiStrategy";

const hideAllMovementPaths = shipIconContainer => {
  shipIconContainer.getArray().forEach(function(icon) {
    icon.hideMovementPath();
  });
};

class MouseOverShowsMovementPath extends UiStrategy {
  deactivate() {
    const { shipIconContainer } = this.services;
    hideAllMovementPaths(shipIconContainer);
  }

  mouseOverShip(payload) {
    const { shipIconContainer, coordinateConverter } = this.services;
    hideAllMovementPaths(shipIconContainer);
    payload.entity.showMovementPath(coordinateConverter);
  }

  mouseOutShip(payload) {
    const { shipIconContainer } = this.services;
    hideAllMovementPaths(shipIconContainer);
  }
}

export default MouseOverShowsMovementPath;