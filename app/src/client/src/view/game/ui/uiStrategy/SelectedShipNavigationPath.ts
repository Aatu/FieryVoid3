import UiStrategy from "./UiStrategy";
import NavigationalMovementPath from "../../movement/NavigationalMovementPath";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import GameData from "@fieryvoid3/model/src/game/GameData";

class SelectedShipNavigationPath extends UiStrategy {
  private ship: Ship | null = null;
  private path: NavigationalMovementPath | null = null;

  deactivate() {
    if (this.path) {
      this.path.remove();
    }
  }

  update(gameData: GameData) {
    const { uiState } = this.getServices();
    super.update(gameData);
    this.show(uiState.getSelectedShip() || undefined);
  }

  shipStateChanged() {
    if (this.ship) {
      if (this.path) {
        this.path.remove();
      }

      this.show(this.ship);
    }
  }

  shipSelected({ ship }: { ship: Ship }) {
    this.show(ship);
  }

  show(ship?: Ship) {
    if (!this.gameData || !ship) {
      return;
    }

    const { coordinateConverter, scene } = this.getServices();

    if (!ship) {
      return;
    }

    this.ship = ship;

    const move = ship.movement.getLastEndMoveOrSurrogate();
    this.path = new NavigationalMovementPath(
      this.gameData.terrain,
      move.position,
      move.velocity,
      100,
      coordinateConverter,
      scene
    );
  }

  shipDeselected() {
    if (this.path) {
      this.path.remove();
    }
  }
}

export default SelectedShipNavigationPath;
