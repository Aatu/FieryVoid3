import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import {
  addToDirection,
  getCompassHeadingOfPoint,
  hexFacingToAngle,
} from "../../../../utils/math.mjs";

class WeaponArcStrategy extends ShipSystemStrategy {
  constructor(arcs = []) {
    super();

    this.arcs = [].concat(arcs);
  }

  hasArcs() {
    return true;
  }

  isPositionOnArc({ targetPosition }) {
    const shooter = this.system.shipSystems.ship;
    const targetHeading = getCompassHeadingOfPoint(
      shooter.getPosition(),
      targetPosition
    );

    const shooterFacing = hexFacingToAngle(shooter.getFacing());
    const arcs = this.getArcs({ facing: shooterFacing });

    return arcs.some(({ start, end }) => {
      if (end === start) {
        return true;
      } else if (end > start) {
        return targetHeading >= start && targetHeading <= end;
      } else if (start > end) {
        return targetHeading <= end || targetHeading >= start;
      }

      return false;
    });
  }

  isOnArc({ target }) {
    return this.isPositionOnArc({ targetPosition: target.getPosition() });
  }

  getArcs({ facing = 0 }) {
    return this.arcs.map(({ start, end }) => {
      if (this.system.shipSystems.ship.movement.isRolled()) {
        return {
          start: addToDirection(addToDirection(0, -end), facing),
          end: addToDirection(addToDirection(0, -start), facing),
        };
      }

      return {
        start: addToDirection(start, facing),
        end: addToDirection(end, facing),
      };
    });
  }
}

export default WeaponArcStrategy;
