import ShipSystemStrategy from "../ShipSystemStrategy";
import {
  addToDirection,
  getCompassHeadingOfPoint,
  hexFacingToAngle,
} from "../../../../utils/math";
import { IVector } from "../../../../utils/Vector";
import Ship from "../../../Ship";

export type WeaponArc = { start: number; end: number };
export type WeaponArcs = WeaponArc | WeaponArc[];

class WeaponArcStrategy extends ShipSystemStrategy {
  private arcs: WeaponArc[];

  constructor(arcs: WeaponArcs = []) {
    super();

    this.arcs = ([] as WeaponArc[]).concat(arcs);
  }

  hasArcs() {
    return true;
  }

  isPositionOnArc({ targetPosition }: { targetPosition: IVector }) {
    const shooter = this.getSystem().getShipSystems().ship;
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

  isOnArc({ target }: { target: Ship }) {
    return this.isPositionOnArc({ targetPosition: target.getPosition() });
  }

  getArcs({ facing = 0 }) {
    return this.arcs.map(({ start, end }) => {
      if (this.getSystem().getShipSystems().ship.movement.isRolled()) {
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
