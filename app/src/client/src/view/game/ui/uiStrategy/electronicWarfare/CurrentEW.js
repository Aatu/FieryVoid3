import UiStrategy from "../UiStrategy";
import * as gameUiModes from "../../gameUiModes";

class CurrentEW extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.services;
    electronicWarfareIndicatorService.hideAllCurrent();
  }

  update(gameData) {
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
    const {
      electronicWarfareIndicatorService,
      uiState,
      currentUser
    } = this.services;

    electronicWarfareIndicatorService.hideAllCurrent();

    if (uiState.hasGameUiMode(gameUiModes.ENEMY_WEAPONS)) {
      this.gameData.ships
        .getShipsEnemyTeams(currentUser)
        .forEach(ship =>
          electronicWarfareIndicatorService.showCurrentForShip(ship)
        );
    }

    if (uiState.hasGameUiMode(gameUiModes.WEAPONS)) {
      this.gameData.ships
        .getShipsInSameTeam(currentUser)
        .forEach(ship =>
          electronicWarfareIndicatorService.showCurrentForShip(ship)
        );
    }
  }
}

export default CurrentEW;
