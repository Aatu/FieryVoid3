import StandardDamageStrategy, {
  DamagePayload,
} from "../../../../strategy/weapon/StandardDamageStrategy";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry";
import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes";
import TorpedoFlight from "../../../../../TorpedoFlight";
import Ship from "../../../../../Ship";
import CombatLogWeaponFire from "../../../../../../combatLog/CombatLogWeaponFire";
import CombatLogTorpedoAttack from "../../../../../../combatLog/CombatLogTorpedoAttack";

export type MSVTorpedoDamageStrategyDamagePayload = DamagePayload & {
  torpedoFlight: TorpedoFlight;
  combatLogEntry: CombatLogTorpedoAttack;
};

export const isMSVTorpedoDamagePayload = (
  payload: DamagePayload
): payload is MSVTorpedoDamageStrategyDamagePayload => {
  return !!(payload as MSVTorpedoDamageStrategyDamagePayload).torpedoFlight;
};

class MSVTorpedoDamageStrategy extends StandardDamageStrategy {
  public rangePenalty: number;
  public numberOfShots: number;
  public strikeHitChance: number;
  public minStrikeDistance: number;
  public msv: boolean;

  constructor(
    damageFormula: string | number,
    armorPiercingFormula: string | number,
    rangePenalty: number,
    numberOfShots: number,
    strikeHitChance: number = 20,
    minStrikeDistance: number = 1
  ) {
    super(damageFormula, armorPiercingFormula);
    this.rangePenalty = rangePenalty;
    this.numberOfShots = numberOfShots;
    this.strikeHitChance = strikeHitChance;
    this.minStrikeDistance = minStrikeDistance;
    this.msv = true;
  }

  getAttackRunMessages(
    payload: { target: Ship; torpedoFlight: TorpedoFlight },
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    return [
      {
        header: "Strike distance",
        value: this.getStrikeDistance(payload),
      },
    ];
  }

  getMessages(payload: unknown, previousResponse: SystemMessage[] = []) {
    previousResponse.push({
      header: "Number of SVs",
      value: this.numberOfShots,
    });

    previousResponse.push({
      header: "Damage per SV",
      value: this.damageFormula || "None",
    });

    previousResponse.push({
      header: "Armor piercing per SV",
      value: this.armorPiercingFormula || "None",
    });

    previousResponse.push({
      header: "SV range penalty",
      value: this.rangePenalty,
    });

    previousResponse.push({
      header: "Target hit chance",
      value: `${this.strikeHitChance}%`,
    });

    return previousResponse;
  }

  _getDamageForWeaponHit({ torpedoFlight }: { torpedoFlight: TorpedoFlight }) {
    if (Number.isInteger(this.damageFormula)) {
      return Math.ceil(this.damageFormula as number);
    }
    return Math.ceil(this.diceRoller.roll(this.damageFormula as string));
  }

  _getArmorPiercing({ torpedoFlight }: { torpedoFlight: TorpedoFlight }) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return Math.round(this.armorPiercingFormula as number);
    }

    return Math.round(
      this.diceRoller.roll(this.armorPiercingFormula as string)
    );
  }

  getHitChance({
    target,
    torpedoFlight,
    distance,
  }: {
    target: Ship;
    torpedoFlight: TorpedoFlight;
    distance: number;
  }) {
    const hitProfile = target.getHitProfile(torpedoFlight.strikePosition);
    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10) * distance;

    return hitProfile - rangeModifier;
  }

  getStrikeDistance(payload: { target: Ship; torpedoFlight: TorpedoFlight }) {
    let distance = 11;

    while (distance--) {
      if (distance === this.minStrikeDistance) {
        return distance;
      }

      if (this.getHitChance({ ...payload, distance }) >= this.strikeHitChance) {
        return distance;
      }
    }

    return 1;
  }

  applyDamageFromWeaponFire(payload: DamagePayload) {
    if (!isMSVTorpedoDamagePayload(payload)) {
      throw new Error("Invalid payload for MSV torpedo damage strategy.");
    }

    const { torpedoFlight, combatLogEntry } = payload;
    const attackPosition = torpedoFlight.strikePosition;

    let shots = this.numberOfShots;

    const distance = this.getStrikeDistance(payload);
    const hitChance = this.getHitChance({ ...payload, distance });

    combatLogEntry.addNote(
      `MSV with ${this.numberOfShots} projectiles at distance ${distance} with hit chance of ${hitChance}% each.`
    );

    let hits = 0;

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitChance;

      if (hit) {
        hits++;
        const result = new CombatLogDamageEntry();
        combatLogEntry.addDamage(result);
        this.doDamage(
          { shooterPosition: attackPosition, ...payload },
          result,
          null
        );
      }
    }

    combatLogEntry.addNote(`${hits} MSVs hit target.`);
  }
}

export default MSVTorpedoDamageStrategy;
