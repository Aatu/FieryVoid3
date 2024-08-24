import GameData from "@fieryvoid3/model/src/game/GameData";
import UiStrategy from "../UiStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class SelectedShipMovementUi extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }

  update(gameData: GameData) {
    super.update(gameData);
    this.shipStateChanged();
  }

  shipStateChanged() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();

    if (ship) {
      uiState.showShipMovement(ship);
    }
  }

  shipSelected(ship: Ship) {
    const { uiState } = this.getServices();
    uiState.showShipMovement(ship);
  }

  shipDeselected() {
    const { uiState } = this.getServices();
    uiState.hideShipMovement();
  }
}

export default SelectedShipMovementUi;
