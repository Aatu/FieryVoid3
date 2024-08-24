import UiStrategy from "../UiStrategy";
import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { GameUIMode } from "../../gameUiModes";

class OwnedShipEw extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.getServices();
    electronicWarfareIndicatorService.hideAll();
  }

  update(gameData: GameData) {
    super.update(gameData);
    this.show();
  }

  uiStateChanged() {
    if (!this.gameData) {
      return;
    }

    this.show();
  }

  shipStateChanged(ship: Ship) {
    const { electronicWarfareIndicatorService, uiState } = this.getServices();
    if (!this.gameData) {
      return;
    }

    if (
      !uiState.hasGameUiMode(GameUIMode.EW) &&
      uiState.getSelectedShip() !== ship
    ) {
      return;
    }

    electronicWarfareIndicatorService.showForShip(ship);
  }

  mouseOutShip() {
    this.show();
  }

  show() {
    const { electronicWarfareIndicatorService, uiState, currentUser } =
      this.getServices();

    electronicWarfareIndicatorService.hideAll();

    if (uiState.hasGameUiMode(GameUIMode.EW)) {
      this.getGameData()
        .ships.getUsersShips(currentUser)
        .forEach((ship) => electronicWarfareIndicatorService.showForShip(ship));
    }

    if (
      !uiState.hasGameUiMode([GameUIMode.ENEMY_WEAPONS, GameUIMode.WEAPONS])
    ) {
      const ship = uiState.getSelectedShip();
      if (ship) {
        electronicWarfareIndicatorService.showForShip(ship);
      }
    }
  }
}

export default OwnedShipEw;
