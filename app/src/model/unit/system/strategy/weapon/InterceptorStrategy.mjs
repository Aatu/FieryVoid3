import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { getCompassHeadingOfPoint } from "../../../../utils/math.mjs";
import { getDistanceBetweenDirections } from "../../../../utils/math.mjs";
import WeaponHitChange from "../../../../weapon/WeaponHitChange.mjs";

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

  getInterceptChance({ target, torpedoFlight, interceptTry = 1 }) {
    let distance = interceptTry;
    const ship = this.system.shipSystems.ship;

    if (target !== ship) {
      const torpedoDistanceToTarget = torpedoFlight
        .getPosition()
        .distanceTo(target.getPosition());

      const interceptorDistanceToTorpedo = ship
        .getPosition()
        .distanceTo(torpedoFlight.getPosition());

      const interceptorDistanceToTarget = ship
        .getPosition()
        .distanceTo(target.getPosition());

      if (
        torpedoDistanceToTarget > interceptorDistanceToTorpedo &&
        interceptorDistanceToTarget < torpedoDistanceToTarget
      ) {
        distance += Math.floor(ship.hexDistanceTo(target) / 2);
      } else {
        distance += ship.hexDistanceTo(target);
      }
    }

    if (distance < torpedoFlight.torpedo.getMinRange()) {
      distance = torpedoFlight.torpedo.getMinRange();
    }

    const rangeModifier =
      this.system.callHandler("getRangeModifier", {
        distance: distance
      }) *
      (1 + torpedoFlight.torpedo.getEvasion() / 10);

    const fireControl = this.system.callHandler("getFireControl", null, 0);

    const dew = ship.electronicWarfare.inEffect.getDefensiveEw();

    const torpedoHitSize = torpedoFlight.torpedo.getHitSize();

    return new WeaponHitChange({
      baseToHit: torpedoHitSize,
      fireControl: fireControl,
      dew,
      oew: 0,
      distance: distance,
      rangeModifier: rangeModifier,
      evasion: torpedoFlight.torpedo.getEvasion(),
      result: Math.round(
        torpedoHitSize + rangeModifier + fireControl + dew * 5
      ),
      absoluteResult: torpedoHitSize + rangeModifier + fireControl + dew * 5
    });
  }
}

export default InterceptorStrategy;
