import GameData from "@fieryvoid3/model/src/game/GameData";
//import ShipIconContainer from "../../renderer/icon/ShipIconContainer";
import UiStrategy from "./UiStrategy";

/*
const hideAllMovementPaths = (shipIconContainer: ShipIconContainer) => {
  shipIconContainer.getArray().forEach(function (icon) {
    icon.hideMovementPath();
  });
};
*/

class SelectedShipMovementPath extends UiStrategy {
  /*
  deactivate() {
    //const { shipIconContainer } = this.getServices();
    //hideAllMovementPaths(shipIconContainer);
  }
    */

  update(gameData: GameData) {
    const { uiState } = this.getServices();
    super.update(gameData);

    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipStateChanged();
    }
  }

  shipStateChanged(/* ship: Ship */) {
    //const { shipIconContainer, uiState } = this.getServices();
    /*
    if (uiState.getSelectedShip() !== ship || !this.gameData) {
      return;
    }
      */
    //hideAllMovementPaths(shipIconContainer);
    //shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  shipSelected(/* ship: Ship */) {
    /*
    const { shipIconContainer } = this.getServices();
    if (!this.gameData) {
      return;
    }
*/
    //hideAllMovementPaths(shipIconContainer);
    //shipIconContainer.getByShip(ship).showMovementPath(this.gameData.terrain);
  }

  mouseOutShip() {
    const { uiState } = this.getServices();
    const ship = uiState.getSelectedShip();
    if (ship) {
      this.shipStateChanged();
    }
  }

  shipDeselected() {
    //const { shipIconContainer } = this.getServices();
    //hideAllMovementPaths(shipIconContainer);
  }
}

export default SelectedShipMovementPath;
