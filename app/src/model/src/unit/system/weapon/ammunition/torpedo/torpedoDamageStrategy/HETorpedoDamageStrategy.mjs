import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.mjs";
import ExplosiveDamageStrategy from "../../../../strategy/weapon/ExplosiveDamageStrategy.mjs";

class HETorpedoDamageStrategy extends ExplosiveDamageStrategy {
  constructor(damageFormula, armorPiercingFormula, numberOfHitsFormula) {
    super(damageFormula, armorPiercingFormula, numberOfHitsFormula);
  }

  getAttackRunMessages(payload, previousResponse = []) {
    return [
      {
        header: "Strike distance",
        value: this.getStrikeDistance(payload)
      }
    ];
  }
  _getDamageMessage() {
    return this.damageFormula;
  }

  _getArmorPiercingMessage() {
    return this.armorPiercingFormula;
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
