import ShipSystemStrategy from "../ShipSystemStrategy.js";
import WeaponHitChance from "../../../../weapon/WeaponHitChance.js";
import Ship from "../../../Ship.js";
import TorpedoFlight from "../../../TorpedoFlight.js";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes.js";

class InterceptorStrategy extends ShipSystemStrategy {
  private numberOfIntercepts: number;
  private heatPerIntercept: number;
  private timesIntercepted: number;

  constructor(numberOfIntercepts: number = 1, heatPerIntercept: number = 0) {
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

  getHeatGenerated(payload: unknown, previousResponse: number = 0): number {
    return previousResponse + this.timesIntercepted * this.heatPerIntercept;
  }

  canIntercept() {
    return true;
  }

  getNumberOfIntercepts() {
    return this.numberOfIntercepts;
  }

  getInterceptChance({
    target,
    torpedoFlight,
  }: {
    target: Ship;
    torpedoFlight: TorpedoFlight;
  }): WeaponHitChance {
    const ship = this.getSystem().getShipSystems().ship;

    let distance = torpedoFlight.torpedo.getDamageStrategy().getStrikeDistance({
      target,
      torpedoFlight,
    });

    if (target !== ship) {
      distance = ship
        .getHexPosition()
        .distanceTo(torpedoFlight.strikePosition.toOffset());
    }

    const rangeModifier =
      this.getSystem().callHandler(
        SYSTEM_HANDLERS.getRangeModifier,
        {
          distance: distance,
        },
        0
      ) *
      (1 + torpedoFlight.torpedo.getEvasion() / 10);

    const fireControl = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getFireControl,
      null,
      0
    );

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
