import StandardDamageStrategy, {
  DamagePayload,
  isStandardDamagePayload,
} from "./StandardDamageStrategy";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
import FireOrder from "../../../../weapon/FireOrder";
import { SystemMessage } from "../types/SystemHandlersTypes";
import { HitResolution } from "./StandardHitStrategy";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult";

class BurstDamageStrategy extends StandardDamageStrategy {
  public shotsFormula: number | string;
  public maxShots: number;
  public grouping: number;

  constructor(
    damageFormula: number | string | null,
    armorPiercingFormula: number | string | null,
    shotsFormula: number | string = 6,
    maxShots: number = 6,
    grouping: number = 10
  ) {
    super(damageFormula, armorPiercingFormula);

    this.shotsFormula = shotsFormula;
    this.maxShots = maxShots;
    this.grouping = grouping;
  }

  getTotalBurstSize() {
    return this.maxShots;
  }

  applyDamageFromWeaponFire(payload: DamagePayload) {
    if (!isStandardDamagePayload(payload)) {
      throw new Error("Invalid payload");
    }

    const { combatLogEntry } = payload;
    const shots = this.getNumberOfShots(payload);

    combatLogEntry.setShots(shots, this.maxShots);

    Array.from(Array(shots)).map(() => {
      const result = new CombatLogDamageEntry();
      combatLogEntry.addDamage(result);
      this.doDamage(
        { shooterPosition: payload.shooter.getPosition(), ...payload },
        result,
        null
      );
      return result;
    });
  }

  protected getDamageTypeMessage() {
    return "Burst";
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Damage type",
      value: this.getDamageTypeMessage(),
    });

    previousResponse.push({
      header: "Burst size",
      value: this.maxShots,
    });

    previousResponse.push({
      header: "Burst grouping",
      value: this.grouping,
    });

    previousResponse.push({
      header: "Damage",
      value: this.getDamageMessage(),
    });

    previousResponse.push({
      header: "Armor piercing",
      value: this.getArmorPiercingMessage(),
    });

    return previousResponse;
  }

  private getNumberOfShots({
    hitResolution,
  }: {
    hitResolution: CombatLogWeaponFireHitResult;
  }) {
    const requiredToHit = hitResolution.hitChance.result;
    const rolledToHit = hitResolution.hitRoll;

    if (rolledToHit > requiredToHit) {
      return 0;
    }

    if (rolledToHit <= requiredToHit - this.maxShots * this.grouping) {
      return this.maxShots;
    }

    let shots = Math.floor((requiredToHit - rolledToHit) / this.grouping);

    if (Number.isInteger(this.shotsFormula)) {
      shots += this.shotsFormula as number;
    } else {
      shots += this.diceRoller.roll(this.shotsFormula);
    }

    if (shots > this.maxShots) {
      shots = this.maxShots;
    }

    if (shots <= 0) {
      shots = 1;
    }

    return shots;
  }
}

export default BurstDamageStrategy;
