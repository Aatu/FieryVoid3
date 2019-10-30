import { ShipMovementAnimation, ShipSystemAnimation } from "../../../animation";

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

    console.log("movement awaited");

    shipIconContainer.getArray().forEach(icon => {
      const ship = icon.ship;
      icon.show();
      this.animations.push(
        new ShipMovementAnimation(icon, getMovesForShip(gameDatas, ship))
      );
      this.animations.push(
        new ShipSystemAnimation(
          icon,
          gameDatas[0].ships.getShipById(icon.ship.id)
        )
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

  getPositionAtTime(icon, percentDone) {
    const animation = this.animations.find(
      animation => animation.shipIcon === icon
    );

    if (!animation) {
      return null;
    }

    return animation.getPositionAndFacing(0, percentDone).position;
  }
}

export default ReplayShipMovement;
