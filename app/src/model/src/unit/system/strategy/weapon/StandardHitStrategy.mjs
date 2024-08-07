import ShipSystemStrategy from "../ShipSystemStrategy.js";
import WeaponHitChance from "../../../../weapon/WeaponHitChance.js";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  constructor(fireControl = 0, numberOfShots = 1) {
    super();
    this.fireControl = fireControl;
    this.numberOfShots = numberOfShots;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Fire control",
      value: this.fireControl,
    });

    return previousResponse;
  }

  getBaseHitChance({ shooter, target }) {
    return target.getHitProfile(shooter.getPosition());
  }

  checkFireOrderHits({ shooter, target, weaponSettings, combatLogEntry }) {
    const toHit = this.getHitChance({ shooter, target, weaponSettings });
    const roll = Math.ceil(Math.random() * 100);

    const hit = roll <= toHit.result;

    const result = new CombatLogWeaponFireHitResult(hit, toHit, roll);
    combatLogEntry.addHitResult(result);

    return result;
  }

  getFireControl() {
    return this.fireControl;
  }

  getHitChance({ shooter, target, weaponSettings = {} }) {
    const baseToHit = this.system.callHandler("getBaseHitChance", {
      shooter,
      target,
      weaponSettings,
    });

    const dew = target.electronicWarfare.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);

    let distance = shooter.hexDistanceTo(target);

    const initialRangeModifier = this.system.callHandler("getRangeModifier", {
      distance: distance,
      weaponSettings,
    });

    const rangeModifier =
      initialRangeModifier * (1 + target.movement.getActiveEvasion() / 10);

    const evasionPenalty = rangeModifier - initialRangeModifier;

    const rollingPenalty = shooter.movement.isRolling() ? -20 : 0;

    const noLockPenalty = oew >= 1 ? 0 : -this.getFireControl();
    const ownEvasionPenalty = -shooter.movement.getActiveEvasion() * 5;

    let result =
      baseToHit +
      rollingPenalty +
      this.getFireControl() +
      oew * 5 +
      dew * 5 +
      rangeModifier +
      noLockPenalty +
      ownEvasionPenalty;

    if (rangeModifier === false) {
      result = 0;
    }

    const onRange = this.system.callHandler("isOnRange", { distance });
    const absoluteResult = result;
    result = Math.floor(result);

    if (result < 0) {
      result = 0;
    }

    return new WeaponHitChance({
      baseToHit,
      fireControl: this.fireControl,
      dew: dew,
      oew: oew,
      distance,
      rangeModifier,
      evasion: target.movement.getActiveEvasion(),
      evasionPenalty: evasionPenalty,
      result: onRange ? result : 0,
      absoluteResult,
      outOfRange: !onRange,
      rollingPenalty,
      noLockPenalty,
      ownEvasionPenalty,
    });
  }
}

export default StandardHitStrategy;
