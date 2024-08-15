import UiStrategy from "./UiStrategy";

class ShipClickSelectsShip extends UiStrategy {
  shipClicked(payload) {
    const { uiState, currentUser } = this.services;
    const ship = payload.entity.ship;

    if (ship.player.isUsers(currentUser) && !uiState.isSelected(ship)) {
      uiState.selectShip(ship);
    }
  }
}

export default ShipClickSelectsShip;
