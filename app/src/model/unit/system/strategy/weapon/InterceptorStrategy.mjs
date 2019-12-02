import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { getCompassHeadingOfPoint } from "../../../../utils/math.mjs";
import { getDistanceBetweenDirections } from "../../../../utils/math.mjs";

class InterceptorStrategy extends ShipSystemStrategy {
  constructor(numberOfIntercepts = 1) {
    super();

    this.numberOfIntercepts = numberOfIntercepts;
  }

  canIntercept() {
    return true;
  }

  getNumberOfIntercepts() {
    return this.numberOfIntercepts;
  }

  getInterceptChance({ target, torpedoFlight }) {
    let distance = 0;

    const ship = this.system.shipSystems.ship;

    if (target !== ship) {
      const angle = getCompassHeadingOfPoint(
        ship.getPosition(),
        target.getPosition().sub(torpedoFlight.velocity)
      );

      if (getDistanceBetweenDirections(angle, torpedoFlight.impactAngle) > 60) {
        distance = ship.hexDistanceTo(target);
      }
    }

    const rangeModifier =
      this.system.callHandler("getRangeModifier", {
        distance: distance
      }) * torpedoFlight.torpedo.getEvasion();

    const fireControl = this.system.callHandler("getFireControl", null, 0);

    const torpedoHitSize = torpedoFlight.torpedo.getHitSize();

    return torpedoHitSize + rangeModifier + fireControl;
  }
}

export default InterceptorStrategy;
