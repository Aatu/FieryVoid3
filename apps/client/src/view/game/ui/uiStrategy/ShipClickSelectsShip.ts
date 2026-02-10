import ShipObject from "../../renderer/ships/ShipObject";
import UiStrategy from "./UiStrategy";

class ShipClickSelectsShip extends UiStrategy {
  shipClicked(payload: { entity: ShipObject }) {
    const { uiState, currentUser } = this.getServices();
    const ship = payload.entity.ship;

    if (ship.player.isUsers(currentUser) && !uiState.isSelected(ship)) {
      uiState.selectShip(ship);
    }
  }
}

export default ShipClickSelectsShip;
