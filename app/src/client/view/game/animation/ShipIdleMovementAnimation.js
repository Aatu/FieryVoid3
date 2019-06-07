import { hexFacingToAngle } from "../../../../model/utils/math.mjs";

import Animation from "./Animation";

class ShipIdleMovementAnimation extends Animation {
  constructor(shipIcon, coordinateConverter) {
    super();

    this.shipIcon = shipIcon;
    this.ship = shipIcon.ship;
    this.coordinateConverter = coordinateConverter;

    this.duration = 0;

    this.position = this.getPosition();
    this.facing = this.getFacing();
  }

  update() {
    this.position = this.getPosition();
    this.facing = this.getFacing();
  }

  stop() {
    super.stop();
  }

  cleanUp() {}

  render(now, total, last, delta, zoom, back, paused) {
    this.shipIcon.setPosition(this.position);
    this.shipIcon.setFacing(-this.facing);
  }

  getPosition() {
    const end = this.ship.movement.getLastEndMoveOrSurrogate();
    return this.coordinateConverter.fromHexToGame(end.position);
  }

  getFacing() {
    return hexFacingToAngle(
      this.ship.movement.getLastEndMoveOrSurrogate().facing
    );
  }
}

window.ShipIdleMovementAnimation = ShipIdleMovementAnimation;

export default ShipIdleMovementAnimation;
