import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.mjs";
import ExplosiveDamageStrategy from "../../../../strategy/weapon/ExplosiveDamageStrategy.mjs";

class HETorpedoDamageStrategy extends ExplosiveDamageStrategy {
  constructor(damageFormula, armorPiercingFormula, numberOfHitsFormula) {
    super(damageFormula, armorPiercingFormula, numberOfHitsFormula);
  }

  getStrikeDistance() {
    return 1;
  }

  applyDamageFromWeaponFire(payload) {
    const { torpedoFlight, combatLogEvent } = payload;
    const attackPosition = torpedoFlight.launchPosition;

    const result = new CombatLogDamageEntry();
    combatLogEvent.addDamage(result);
    this._doDamage({ shooterPosition: attackPosition, ...payload }, result);
  }
}

export default HETorpedoDamageStrategy;
