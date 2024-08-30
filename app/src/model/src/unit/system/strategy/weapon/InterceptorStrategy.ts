import ShipSystemStrategy from "../ShipSystemStrategy";
import WeaponHitChance from "../../../../weapon/WeaponHitChance";
import Ship from "../../../Ship";
import TorpedoFlight from "../../../TorpedoFlight";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import { TorpedoFlightForIntercept } from "../../../TorpedoFlightForIntercept";

class InterceptorStrategy extends ShipSystemStrategy {
  private usedIntercepts: number = 0;

  getUsedIntercepts() {
    return this.usedIntercepts;
  }

  addUsedIntercept(amount = 1) {
    this.usedIntercepts += amount;
  }

  canIntercept() {
    return true;
  }

  onWeaponFired() {
    this.usedIntercepts++;
  }

  getInterceptChance({
    target,
    torpedoFlight,
  }: {
    target: Ship;
    torpedoFlight: TorpedoFlight | TorpedoFlightForIntercept;
  }): WeaponHitChance {
    let distance: number = 0;

    const ship = this.getSystem().getShipSystems().ship;

    if (torpedoFlight instanceof TorpedoFlightForIntercept) {
      distance = torpedoFlight
        .getCurrentHexPosition()
        .distanceTo(ship.getHexPosition());
    } else if (ship.id === target.id) {
      distance = torpedoFlight.torpedo.getDamageStrategy().getStrikeDistance({
        target,
        torpedoFlight,
      });
    } else if (target !== ship) {
      const forIntercept = new TorpedoFlightForIntercept(torpedoFlight, target);

      distance = forIntercept.getClosestDistanceTo(ship);
    } else {
      distance = new TorpedoFlightForIntercept(
        torpedoFlight,
        target
      ).getClosestDistanceTo(ship);
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
    this.usedIntercepts = 0;
  }
}

export default InterceptorStrategy;
