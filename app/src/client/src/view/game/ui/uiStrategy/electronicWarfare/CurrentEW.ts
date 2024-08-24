import { GameUIMode } from "../../gameUiModes";
import UiStrategy from "../UiStrategy";
import GameData from "@fieryvoid3/model/src/game/GameData";

class CurrentEW extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.getServices();
    electronicWarfareIndicatorService.hideAllCurrent();
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

  mouseOutShip() {
    this.show();
  }

  show() {
    const { electronicWarfareIndicatorService, uiState, currentUser } =
      this.getServices();

    electronicWarfareIndicatorService.hideAllCurrent();

    if (uiState.hasGameUiMode(GameUIMode.ENEMY_WEAPONS)) {
      this.getGameData()
        .ships.getShipsEnemyTeams(currentUser)
        .forEach((ship) =>
          electronicWarfareIndicatorService.showCurrentForShip(ship)
        );
    }

    if (uiState.hasGameUiMode(GameUIMode.WEAPONS)) {
      this.getGameData()
        .ships.getShipsInSameTeam(currentUser)
        .forEach((ship) =>
          electronicWarfareIndicatorService.showCurrentForShip(ship)
        );
    }
  }
}

export default CurrentEW;
