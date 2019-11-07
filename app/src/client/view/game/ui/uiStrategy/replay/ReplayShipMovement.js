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
  constructor(replayContext) {
    super();
    this.replayContext = replayContext;
    this.ready = false;
    this.replayContext.setReplayShipMovement(this);
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
      this.animations.push(
        new ShipSystemAnimation(
          icon,
          gameDatas[0].ships.getShipById(icon.ship.id)
        )
      );
    });

    this.ready = true;
  }

  render(payload) {
    const turnDone = this.replayContext.getMovementTurnDone(payload);
    const turn = Math.floor(turnDone);
    const percentDone = turnDone % 1;

    this.animations.forEach(animation =>
      animation.render({
        ...payload,
        turn,
        percentDone
      })
    );
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
