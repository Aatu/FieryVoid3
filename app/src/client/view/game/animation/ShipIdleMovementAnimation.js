import { hexFacingToAngle } from "../../../../model/utils/math.mjs";

import Animation from "./Animation";
import MovementService from "../../../../model/movement/MovementService.mjs";

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
    const end = this.movementService.getNewEndMove(this.ship, this.gameTerrain);
    return end.position;
  }

  getFacing() {
    return hexFacingToAngle(this.ship.movement.getLastMove().facing);
  }
}

export default ShipIdleMovementAnimation;
