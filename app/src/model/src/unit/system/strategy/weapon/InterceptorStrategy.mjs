import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { getCompassHeadingOfPoint } from "../../../../utils/math.mjs";
import { getDistanceBetweenDirections } from "../../../../utils/math.mjs";
import WeaponHitChance from "../../../../weapon/WeaponHitChance.js";

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

  getInterceptChance({ target, torpedoFlight }) {
    const ship = this.system.shipSystems.ship;

    let distance = torpedoFlight.torpedo.damageStrategy.getStrikeDistance({
      target,
      torpedoFlight,
    });

    if (target !== ship) {
      distance = ship
        .getHexPosition()
        .distanceTo(torpedoFlight.strikePosition.toOffset());
    }

    const rangeModifier =
      this.system.callHandler("getRangeModifier", {
        distance: distance,
      }) *
      (1 + torpedoFlight.torpedo.getEvasion() / 10);

    const fireControl = this.system.callHandler("getFireControl", null, 0);

    const ccew = ship.electronicWarfare.getCcEw();

    const torpedoHitSize = torpedoFlight.torpedo.getHitSize();

    const rollingPenalty = ship.movement.isRolling() ? -20 : 0;

    return new WeaponHitChance({
      baseToHit: torpedoHitSize,
      fireControl,
      dew: 0,
      oew: ccew,
      distance,
      rangeModifier,
      evasion: torpedoFlight.torpedo.getEvasion(),
      rollingPenalty,
      result: Math.round(
        torpedoHitSize + rangeModifier + fireControl + ccew * 5 + rollingPenalty
      ),
      absoluteResult:
        torpedoHitSize +
        rangeModifier +
        fireControl +
        ccew * 5 +
        rollingPenalty,
    });
  }

  advanceTurn() {
    this.timesIntercepted = 0;
  }
}

export default InterceptorStrategy;
