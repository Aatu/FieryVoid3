import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import FireOrderHitResult from "../../../../weapon/FireOrderHitResult.mjs";
import WeaponHitChange from "../../../../weapon/WeaponHitChange.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  constructor(fireControl = 0, numberOfShots = 1) {
    super();
    this.fireControl = fireControl;
    this.numberOfShots = numberOfShots;
  }

  getBaseHitChange({ shooter, target, weaponSettings }) {
    return target.getHitProfile(shooter.getShootingPosition());
  }

  checkFireOrderHits({ shooter, target, weaponSettings, fireOrder }) {
    const toHit = this.getHitChange({ shooter, target, weaponSettings });
    const roll = Math.ceil(Math.random() * 100);

    const hit = roll <= toHit.result;

    fireOrder.result.setDetails(new FireOrderHitResult(hit, toHit, roll));

    return {
      requiredToHit: toHit.result,
      rolledToHit: roll
    };
  }

  getHitChange({ shooter, target, weaponSettings = {} }) {
    const baseToHit = this.system.callHandler("getBaseHitChange", {
      shooter,
      target,
      weaponSettings
    });

    const dew = target.electronicWarfare.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);

    let distance = shooter
      .getShootingHexPosition()
      .distanceTo(target.getShootingHexPosition());

    const rangeDistance = oew === 0 ? distance * 2 : distance;

    const rangeModifier = this.system.callHandler("getRangeModifier", {
      distance: rangeDistance,
      weaponSettings
    });

    let result =
      baseToHit + this.fireControl + oew * 5 - dew * 5 + rangeModifier;

    if (rangeModifier === false) {
      result = 0;
    }

    const onRange = this.system.callHandler("isOnRange", { distance });
    const absoluteResult = result;
    result = Math.floor(result);

    if (result < 0) {
      result = 0;
    }

    return new WeaponHitChange({
      baseToHit,
      fireControl: this.fireControl,
      dew: dew,
      oew: oew,
      distance,
      rangeModifier,
      result: onRange ? result : 0,
      absoluteResult,
      outOfRange: !onRange
    });
  }
}

export default StandardHitStrategy;
