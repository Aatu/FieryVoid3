import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import WeaponHitChange from "../../../../weapon/WeaponHitChange.mjs";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  constructor(fireControl = 0, numberOfShots = 1) {
    super();
    this.fireControl = fireControl;
    this.numberOfShots = numberOfShots;
  }

  getBaseHitChange({ shooter, target }) {
    return target.getHitProfile(shooter.getPosition());
  }

  checkFireOrderHits({ shooter, target, weaponSettings, combatLogEntry }) {
    const toHit = this.getHitChange({ shooter, target, weaponSettings });
    const roll = Math.ceil(Math.random() * 100);

    const hit = roll <= toHit.result;

    const result = new CombatLogWeaponFireHitResult(hit, toHit, roll);
    combatLogEntry.addHitResult(result);

    return result;
  }

  getFireControl() {
    return this.fireControl;
  }

  getHitChange({ shooter, target, prediction = false, weaponSettings = {} }) {
    const baseToHit = this.system.callHandler("getBaseHitChange", {
      shooter,
      target,
      weaponSettings
    });

    const dew = target.electronicWarfare.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);

    let distance = prediction
      ? shooter.finalHexDistanceTo(target)
      : shooter.hexDistanceTo(target);

    const rangeDistance = oew === 0 ? distance * 2 : distance;

    const rangeModifier =
      this.system.callHandler("getRangeModifier", {
        distance: rangeDistance,
        weaponSettings
      }) *
      (1 + target.movement.getEvasion() / 10);

    const rollingPenalty = shooter.movement.isRolling() ? -20 : 0;

    let result =
      baseToHit +
      rollingPenalty +
      this.getFireControl() +
      oew * 5 -
      dew * 5 +
      rangeModifier;

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
      evasion: target.movement.getEvasion(),
      result: onRange ? result : 0,
      absoluteResult,
      outOfRange: !onRange,
      rollingPenalty
    });
  }
}

export default StandardHitStrategy;
