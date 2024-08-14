import ShipSystemStrategy from "../ShipSystemStrategy";
import WeaponHitChance from "../../../../weapon/WeaponHitChance";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult";
import { SYSTEM_HANDLERS, SystemMessage } from "../types/SystemHandlersTypes";
import Ship from "../../../Ship";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";

export type HitResolution = {
  shooter: Ship;
  target: Ship;
  weaponSettings: Record<string, unknown>;
  combatLogEntry: CombatLogWeaponFire;
};

class StandardHitStrategy extends ShipSystemStrategy {
  public fireControl: number;
  public numberOfShots: number;

  constructor(fireControl: number = 0, numberOfShots: number = 1) {
    super();
    this.fireControl = fireControl;
    this.numberOfShots = numberOfShots;
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Fire control",
      value: this.fireControl,
    });

    return previousResponse;
  }

  getBaseHitChance({ shooter, target }: { shooter: Ship; target: Ship }) {
    return target.getHitProfile(shooter.getPosition());
  }

  checkFireOrderHits({
    shooter,
    target,
    weaponSettings,
    combatLogEntry,
  }: HitResolution) {
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

  getHitChance({
    shooter,
    target,
    weaponSettings = {},
  }: {
    shooter: Ship;
    target: Ship;
    weaponSettings: Record<string, unknown>;
  }) {
    const baseToHit = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getBaseHitChance,
      {
        shooter,
        target,
        weaponSettings,
      },
      0 as number
    );

    const dew = target.electronicWarfare.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);

    let distance = shooter.hexDistanceTo(target);

    const initialRangeModifier = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getRangeModifier,
      {
        distance: distance,
        weaponSettings,
      },
      0 as number
    );

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

    const onRange = this.getSystem().callHandler(
      SYSTEM_HANDLERS.isOnRange,
      {
        distance,
      },
      false as boolean
    );
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
