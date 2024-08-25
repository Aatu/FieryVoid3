import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import Vector from "../../../../utils/Vector";
import { SystemMessage } from "../types/SystemHandlersTypes";
import StandardDamageStrategy, {
  DamagePayload,
} from "./StandardDamageStrategy";

class ExplosiveDamageStrategy extends StandardDamageStrategy {
  private numberOfDamagesFormula: string | number;

  constructor(
    damageFormula: number | string,
    armorPiercingFormula: number | string,
    numberOfDamagesFormula: number | string = 1
  ) {
    super(damageFormula, armorPiercingFormula);

    this.numberOfDamagesFormula = numberOfDamagesFormula;
  }

  protected getDamageTypeMessage() {
    return "Explosive";
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
      header: "Number of hits",
      value: this.numberOfDamagesFormula,
    });

    previousResponse.push({
      header: "Damage per hit",
      value: this.getDamageMessage(),
    });

    previousResponse.push({
      header: "Armor piercing per hit",
      value: this.getArmorPiercingMessage(),
    });

    return previousResponse;
  }

  protected getNumberOfDamagesForWeaponHit(): number {
    if (Number.isInteger(this.numberOfDamagesFormula)) {
      return this.numberOfDamagesFormula as number;
    }
    return this.diceRoller.roll(this.numberOfDamagesFormula);
  }

  protected doDamage(
    payload: DamagePayload & { shooterPosition: Vector },
    damageResult: CombatLogDamageEntry
  ) {
    const { target, shooterPosition } = payload;

    let numberOfDamages = this.getNumberOfDamagesForWeaponHit();

    while (numberOfDamages--) {
      const hitSystem = this.chooseHitSystem({
        target,
        shooterPosition,
      });

      if (!hitSystem) {
        return;
      }

      this.doDamageToSystem(
        payload,
        damageResult,
        hitSystem,
        this.getArmorPiercing(payload),
        this.getDamageForWeaponHit(payload)
      );
    }
  }
}

export default ExplosiveDamageStrategy;
