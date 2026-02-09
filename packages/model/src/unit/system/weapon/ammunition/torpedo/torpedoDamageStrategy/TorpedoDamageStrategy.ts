import Ship from "../../../../../Ship";
import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes";
import {
  CombatLogEntry,
  UnifiedDamagePayload,
  UnifiedDamageStrategy,
  UnifiedDamageStrategyArgs,
} from "../../../../strategy/weapon/UnifiedDamageStrategy";
import HitSystemRandomizer from "../../../../strategy/weapon/utils/HitSystemRandomizer";
import TorpedoFlight from "../../../../../TorpedoFlight";
import {
  DiceRoller,
  DiceRollFormula,
} from "../../../../../../utils/DiceRoller";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry";

export type TorpedoDamagePayload = {
  target: Ship;
  torpedoFlight: TorpedoFlight;
  combatLogEntry: CombatLogEntry;
  diceRoller?: DiceRoller;
  hitSystemRandomizer?: HitSystemRandomizer;
};

type TorpedoDamageStrategyMsVArgs = {
  msvAmount: DiceRollFormula;
  msvRangePenalty: number;
  msvStrikeHitChanceTarget: number;
  msvMinStrikeDistance: number;
  msvHitBonus: number;
  msvEvasionModifier: number;
};

class TorpedoDamageStrategy {
  protected damageStrategy: UnifiedDamageStrategy;
  protected msvAmount: DiceRollFormula = 0;
  protected msvRangePenalty: number = 0;
  protected msvStrikeHitChanceTarget: number = 20;
  protected msvMinStrikeDistance: number = 0;
  protected hitBonus: number = 0;
  protected evasionModifier: number = 0;

  constructor(
    args: Partial<UnifiedDamageStrategyArgs>,
    msvArgs?: Partial<TorpedoDamageStrategyMsVArgs>
  ) {
    this.damageStrategy = new UnifiedDamageStrategy(args);

    this.msvAmount = msvArgs?.msvAmount || 0;
    this.msvRangePenalty = msvArgs?.msvRangePenalty || 0;
    this.msvStrikeHitChanceTarget = msvArgs?.msvStrikeHitChanceTarget || 0;
    this.msvMinStrikeDistance = msvArgs?.msvMinStrikeDistance || 0;
    this.hitBonus = msvArgs?.msvHitBonus || 0;
    this.evasionModifier = msvArgs?.msvEvasionModifier || 0;
  }

  isMsv() {
    return Boolean(this.msvAmount);
  }

  getMsvAmount() {
    return this.msvAmount;
  }

  public getAttackRunMessages(
    payload: { target: Ship; torpedoFlight: TorpedoFlight },
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    return [
      ...previousResponse,
      {
        header: "Strike distance",
        value: this.getStrikeDistance(payload),
      },
    ];
  }

  public getMessages(payload: unknown, previousResponse: SystemMessage[] = []) {
    if (this.msvAmount) {
      previousResponse.push({
        header: "Number of SVs",
        value: this.msvAmount.toString(),
      });

      /*
      previousResponse.push({
        header: "Damage per SV",
        value: this.damageFormula || "None",
      });

      previousResponse.push({
        header: "Armor piercing per SV",
        value: this.armorPiercingFormula || "None",
      });
      */

      previousResponse.push({
        header: "SV range penalty",
        value: this.msvRangePenalty,
      });

      previousResponse.push({
        header: "Target hit chance",
        value: `${this.msvStrikeHitChanceTarget}%`,
      });
    }

    return previousResponse;
  }

  public getStrikeDistance(payload: {
    target: Ship;
    torpedoFlight: TorpedoFlight;
  }) {
    if (this.msvAmount === 0) {
      return 0;
    }

    let distance = 11;

    while (distance--) {
      if (distance === this.msvMinStrikeDistance) {
        return distance;
      }

      if (
        this.getHitChance({ ...payload, distance }) >=
        this.msvStrikeHitChanceTarget
      ) {
        return distance;
      }
    }

    return 1;
  }

  private getHitChance({
    target,
    torpedoFlight,
    distance,
  }: {
    target: Ship;
    torpedoFlight: TorpedoFlight;
    distance: number;
  }) {
    const hitProfile =
      target.getHitProfile(torpedoFlight.strikePosition) + this.hitBonus;
    const rangeModifier =
      this.msvRangePenalty *
      (1 + (target.movement.getEvasion() * this.evasionModifier) / 10) *
      distance;

    return hitProfile - rangeModifier;
  }

  public applyDamageFromWeaponFire(payload: TorpedoDamagePayload) {
    const attackPosition = payload.torpedoFlight.launchPosition;

    const damagePayload = {
      ...payload,
      attackPosition,
    };

    if (this.msvAmount) {
      this.applyDamageFromMSVTorpedo(damagePayload);
    } else {
      this.applyDamageFromNormalTorpedo(damagePayload);
    }
  }

  private applyDamageFromMSVTorpedo(
    payload: TorpedoDamagePayload & UnifiedDamagePayload
  ) {
    const { combatLogEntry } = payload;

    const diceRoller = payload.diceRoller || new DiceRoller();

    const distance = this.getStrikeDistance(payload);
    const hitChance = this.getHitChance({ ...payload, distance });

    let shots = diceRoller.roll(this.msvAmount);

    combatLogEntry.addNote(
      `MSV with ${shots} projectiles at distance ${distance} with hit chance of ${hitChance}% each.`
    );

    let hits = 0;

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitChance;

      if (hit) {
        hits++;
        const combatLogDamageEntry = new CombatLogDamageEntry();
        this.damageStrategy.applyDamageFromWeaponFire({
          ...payload,
          combatLogDamageEntry,
        });
      }
    }

    combatLogEntry.addNote(`${hits} MSVs hit target.`);
  }

  public applyDamageFromNormalTorpedo(payload: UnifiedDamagePayload) {
    this.damageStrategy.applyDamageFromWeaponFire(payload);
  }
}

export default TorpedoDamageStrategy;
