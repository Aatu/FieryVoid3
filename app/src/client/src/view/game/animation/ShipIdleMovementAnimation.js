import { hexFacingToAngle } from "../../../../model/utils/math";

import Animation from "./Animation";
import MovementService from "../../../../model/movement/MovementService";

class ShipIdleMovementAnimation extends Animation {
  constructor(shipIcon, gameTerrain) {
    super();

    this.gameTerrain = gameTerrain;

    this.shipIcon = shipIcon;
    this.ship = shipIcon.ship;

    this.duration = 0;
    this.movementService = new MovementService();

    this.position = this.getPosition();
    this.facing = this.getFacing();
    this.roll = this.getRoll();
  }

  update() {
    this.position = this.getPosition();
    this.facing = this.getFacing();
    this.roll = this.getRoll();
  }

  deactivate() {}

  render(now, total, last, delta, zoom, back, paused) {
    this.shipIcon.setPosition(this.position);
    this.shipIcon.setFacing(-this.facing);
    this.shipIcon.setFacing(-this.facing);
    this.shipIcon.setRoll(this.roll);
  }

  getRoll() {
    const roll = this.shipIcon.ship.movement.isRolled() ? 180 : 0;

    if (this.shipIcon.ship.movement.isRolling()) {
      return roll + 90;
    }

    return roll;
  }

  getPosition() {
    const end = this.ship.movement.getLastEndMoveOrSurrogate();
    return end.position;
  }

  getFacing() {
    return hexFacingToAngle(
      this.ship.movement.getLastEndMoveOrSurrogate().facing
    );
  }
}

export default ShipIdleMovementAnimation;
