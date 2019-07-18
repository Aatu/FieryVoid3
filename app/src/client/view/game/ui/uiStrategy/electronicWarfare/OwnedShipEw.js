import UiStrategy from "../UiStrategy";
import * as gameUiModes from "../../gameUiModes";

class OwnedShipEw extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.services;
    electronicWarfareIndicatorService.hideAll();
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

  shipStateChanged(ship) {
    const { electronicWarfareIndicatorService, uiState } = this.services;
    if (!this.gameData) {
      return;
    }

    if (
      !uiState.hasGameUiMode(gameUiModes.EW) &&
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
    const {
      electronicWarfareIndicatorService,
      uiState,
      currentUser
    } = this.services;

    electronicWarfareIndicatorService.hideAll();

    if (uiState.hasGameUiMode(gameUiModes.EW)) {
      this.gameData.ships
        .getUsersShips(currentUser)
        .forEach(ship => electronicWarfareIndicatorService.showForShip(ship));
    }

    if (
      !uiState.hasGameUiMode([gameUiModes.ENEMY_WEAPONS, gameUiModes.WEAPONS])
    ) {
      const ship = uiState.getSelectedShip();
      if (ship) {
        electronicWarfareIndicatorService.showForShip(ship);
      }
    }
  }
}

export default OwnedShipEw;
