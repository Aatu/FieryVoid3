import UiStrategy from "./UiStrategy";
import NavigationalMovementPath from "../../../game/movement/NavigationalMovementPath";

class MouseOverShowsNavigationPath extends UiStrategy {
  constructor() {
    super();

    this.ship = null;
    this.path = null;
  }

  deactivate() {
    if (this.path) {
      this.path.remove();
    }
  }

  update(gameData) {
    const { uiState } = this.services;
    super.update(gameData);
    this.show(uiState.getSelectedShip());
  }

  shipMovementChanged() {
    if (this.ship) {
      if (this.path) {
        this.path.remove();
      }

      this.show(this.ship);
    }
  }

  shipSelected(ship) {
    this.show(ship);
  }

  show(ship) {
    if (!this.gameData) {
      return;
    }

    const { coordinateConverter, scene } = this.services;

    if (!ship) {
      return;
    }

    this.ship = ship;

    const move = ship.movement.getLastEndMoveOrSurrogate();
    this.path = new NavigationalMovementPath(
      this.gameData.terrain,
      move,
      100,
      coordinateConverter,
      scene
    );
  }

  shipDeselected(ship) {
    if (this.path) {
      this.path.remove();
    }
  }
}

export default MouseOverShowsNavigationPath;
