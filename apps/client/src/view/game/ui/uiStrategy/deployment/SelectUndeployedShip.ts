import GameData from "@fieryvoid3/model/src/game/GameData";
import UiStrategy from "../UiStrategy";

class SelectUndeployedShip extends UiStrategy {
  update(gameData: GameData) {
    const { uiState, currentUser } = this.getServices();

    if (uiState.getSelectedShip() || !currentUser) {
      return;
    }

    const ships = gameData.getShipsForUser(currentUser);
    let ship = ships.find((s) => s.movement.getDeployMove());

    if (!ship) {
      ship = ships[0];
    }

    if (!ship) {
      return;
    }

    uiState.selectShip(ship);
  }
}

export default SelectUndeployedShip;
