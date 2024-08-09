import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.js";
import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes.js";
import ExplosiveDamageStrategy from "../../../../strategy/weapon/ExplosiveDamageStrategy.js";
import { DamagePayload } from "../../../../strategy/weapon/StandardDamageStrategy.js";
import { isMSVTorpedoDamagePayload } from "./MSVTorpedoDamageStrategy.js";
class HETorpedoDamageStrategy extends ExplosiveDamageStrategy {
  constructor(
    damageFormula: string | number,
    armorPiercingFormula: string | number,
    numberOfHitsFormula: string | number
  ) {
    super(damageFormula, armorPiercingFormula, numberOfHitsFormula);
  }

  getAttackRunMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    return [
      {
        header: "Strike distance",
        value: this.getStrikeDistance(),
      },
    ];
  }

  getDamageMessage() {
    return (this.damageFormula as string) || "";
  }

  getArmorPiercingMessage() {
    return (this.armorPiercingFormula as string) || "";
  }

  getStrikeDistance() {
    return 1;
  }

  applyDamageFromWeaponFire(payload: DamagePayload) {
    if (!isMSVTorpedoDamagePayload(payload)) {
      throw new Error("Invalid payload");
    }

    const { torpedoFlight, combatLogEntry } = payload;
    const attackPosition = torpedoFlight.launchPosition;

    const result = new CombatLogDamageEntry();
    combatLogEntry.addDamage(result);
    this.doDamage({ shooterPosition: attackPosition, ...payload }, result);
  }
}

export default HETorpedoDamageStrategy;
