import UiStrategy from "./UiStrategy";
import * as THREE from "three";

class AllowSubmittingWhenDeploymentDone extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.setTurnReady(false);
  }

  update(gameData) {
    super.update(gameData);
    this.checkDeployment();
  }

  shipMovementChanged() {
    this.checkDeployment();
  }

  checkDeployment() {
    const { currentUser, uiState } = this.services;
    const result = this.gameData.ships.getShips().every(ship => {
      if (!ship.player.isUsers(currentUser)) {
        return true;
      }

      const slot = this.gameData.slots.getSlotByShip(ship);

      if (slot.isValidShipDeployment(ship, ship.getHexPosition())) {
        return true;
      }

      return false;
    });

    uiState.setTurnReady(result);
  }
}

export default AllowSubmittingWhenDeploymentDone;
