import Ship from "@fieryvoid3/model/src/unit/Ship";
import UiStrategy from "../UiStrategy";

class SelectedShipEwList extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.setEwList([]);
  }

  shipStateChanged() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();

    if (!ship) {
      return;
    }

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }

  shipSelected({ ship }: { ship: Ship }) {
    const { uiState } = this.getServices();
    if (!this.gameData) {
      return;
    }

    uiState.setEwList(ship.electronicWarfare.getAllOew());
  }
}

export default SelectedShipEwList;
