import { ShipMovementAnimation } from "../../../animation";

import AnimationUiStrategy from "../AnimationUiStrategy";

const getMovesForShip = (gameDatas, ship) =>
  gameDatas.reduce((moves, gameData) => {
    return [
      ...moves,
      ...gameData.ships.getShipById(ship.id).movement.getMovement()
    ];
  }, []);

class ReplayShipMovement extends AnimationUiStrategy {
  constructor() {
    super();
  }

  async newTurn(gameDatas) {
    const { shipIconContainer } = this.services;

    await shipIconContainer.shipsLoaded();

    shipIconContainer.getArray().forEach(icon => {
      const ship = icon.ship;
      icon.show();
      this.animations.push(
        new ShipMovementAnimation(icon, getMovesForShip(gameDatas, ship))
      );
    });
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(function(icon) {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ReplayShipMovement;
