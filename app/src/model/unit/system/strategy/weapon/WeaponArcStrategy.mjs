import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import {
  addToDirection,
  getCompassHeadingOfPoint,
  hexFacingToAngle
} from "../../../../utils/math.mjs";

class WeaponArcStrategy extends ShipSystemStrategy {
  constructor(arcs) {
    super();

    this.arcs = arcs;
  }

  isOnArc({ shooter, target }) {
    const targetHeading = getCompassHeadingOfPoint(
      shooter.getPosition(),
      target.getPosition()
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

  getArcs({ facing = 0 }) {
    return this.arcs.map(({ start, end }) => ({
      start: addToDirection(start, facing),
      end: addToDirection(end, facing)
    }));
  }
}

export default WeaponArcStrategy;