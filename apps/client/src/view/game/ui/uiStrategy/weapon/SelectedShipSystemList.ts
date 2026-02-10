import GameData from "@fieryvoid3/model/src/game/GameData";
import UiStrategy from "../UiStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class SelectedShipSystemList extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.setSystemList([]);
  }

  update(gameData: GameData) {
    const { uiState } = this.getServices();
    super.update(gameData);

    const ship = uiState.getSelectedShip();
    if (ship) {
      uiState.setSystemList(
        ship.systems.getSystems().filter((system) => system.showOnSystemList())
      );
    }
  }

  shipSelected({ ship }: { ship: Ship }) {
    const { uiState } = this.getServices();
    if (!this.gameData) {
      return;
    }

    uiState.setSystemList(
      ship.systems.getSystems().filter((system) => system.showOnSystemList())
    );
  }
}

export default SelectedShipSystemList;
