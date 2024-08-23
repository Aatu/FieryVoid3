import ShipObject from "../renderer/ships/ShipObject";
import Animation from "./Animation";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { hexFacingToAngle } from "@fieryvoid3/model/src/utils/math";

class ShipIdleMovementAnimation extends Animation {
  private shipIcon: ShipObject;
  private ship: Ship;
  private position: Vector;
  private facing: number;
  private roll: number;

  constructor(shipIcon: ShipObject) {
    super();

    this.shipIcon = shipIcon;
    this.ship = shipIcon.ship;

    this.duration = 0;

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

  render() {
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

  getPosition(): Vector {
    const end = this.ship.movement.getLastEndMoveOrSurrogate();
    return end.position;
  }

  getFacing(): number {
    return hexFacingToAngle(
      this.ship.movement.getLastEndMoveOrSurrogate().facing
    );
  }
}

export default ShipIdleMovementAnimation;
