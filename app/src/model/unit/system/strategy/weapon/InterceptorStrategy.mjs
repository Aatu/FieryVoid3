import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { getCompassHeadingOfPoint } from "../../../../utils/math.mjs";
import { getDistanceBetweenDirections } from "../../../../utils/math.mjs";
import WeaponHitChange from "../../../../weapon/WeaponHitChange.mjs";

class InterceptorStrategy extends ShipSystemStrategy {
  constructor(numberOfIntercepts = 1, heatPerIntercept = 0) {
    super();

    this.numberOfIntercepts = numberOfIntercepts;
    this.heatPerIntercept = heatPerIntercept;
    this.timesIntercepted = 0;
  }

  getInterceptHeat() {
    return this.timesIntercepted * this.heatPerIntercept;
  }

  getHeatPerIntercept() {
    return this.heatPerIntercept;
  }

  addTimesIntercepted(amount = 1) {
    this.timesIntercepted += amount;
  }

  getHeatGenerated(payload, previousResponse = 0) {
    return previousResponse + this.timesIntercepted * this.heatPerIntercept;
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
      const torpedoDistanceToTarget = torpedoFlight.position.distanceTo(
        target.getPosition()
      );

      const interceptorDistanceToTorpedo = ship
        .getPosition()
        .distanceTo(torpedoFlight.position);

      const interceptorDistanceToTarget = ship
        .getPosition()
        .distanceTo(target.getPosition());

      if (
        torpedoDistanceToTarget > interceptorDistanceToTorpedo &&
        interceptorDistanceToTarget < torpedoDistanceToTarget
      ) {
        distance += ship.hexDistanceTo(target);
      } else {
        distance += ship.hexDistanceTo(target) * 2;
      }
    }

    const rangeModifier =
      this.system.callHandler("getRangeModifier", {
        distance: distance
      }) *
      (1 + torpedoFlight.torpedo.getEvasion() / 10);

    const fireControl = this.system.callHandler("getFireControl", null, 0);

    const ccew = ship.electronicWarfare.getCcEw();

    const torpedoHitSize = torpedoFlight.torpedo.getHitSize();

    return new WeaponHitChange({
      baseToHit: torpedoHitSize,
      fireControl: fireControl,
      dew: 0,
      oew: ccew,
      distance: distance,
      rangeModifier: rangeModifier,
      evasion: torpedoFlight.torpedo.getEvasion(),
      result: Math.round(
        torpedoHitSize + rangeModifier + fireControl + ccew * 5
      ),
      absoluteResult: torpedoHitSize + rangeModifier + fireControl + ccew * 5
    });
  }

  advanceTurn() {
    this.timesIntercepted = 0;
  }
}

export default InterceptorStrategy;
