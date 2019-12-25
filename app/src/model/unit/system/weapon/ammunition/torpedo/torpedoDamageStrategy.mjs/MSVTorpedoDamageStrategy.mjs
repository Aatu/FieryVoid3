import StandardDamageStrategy from "../../../../strategy/weapon/StandardDamageStrategy.mjs";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.mjs";

class MSVTorpedoDamageStrategy extends StandardDamageStrategy {
  constructor(
    damageFormula,
    armorPiercingFormula,
    rangePenalty,
    numberOfShots
  ) {
    super(damageFormula, armorPiercingFormula);
    this.rangePenalty = rangePenalty;
    this.numberOfShots = numberOfShots;
  }

  _getDamageForWeaponHit({ torpedoFlight }) {
    if (Number.isInteger(this.damageFormula)) {
      return this.damageFormula * torpedoFlight.getRelativeVelocityRatio();
    }
    return (
      this.diceRoller.roll(this.damageFormula).total *
      torpedoFlight.getRelativeVelocityRatio()
    );
  }

  _getArmorPiercing({ torpedoFlight }) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return (
        this.armorPiercingFormula * torpedoFlight.getRelativeVelocityRatio()
      );
    }

    return (
      this.diceRoller.roll(this.armorPiercingFormula).total *
      torpedoFlight.getRelativeVelocityRatio()
    );
  }

  applyDamageFromWeaponFire({ torpedoFlight, target, combatLogEvent }) {
    const attackPosition = torpedoFlight.position;
    const hitProfile = target.getHitProfile(attackPosition);

    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10);

    let shots = this.numberOfShots;

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitProfile - rangeModifier;

      if (hit) {
        const result = new CombatLogDamageEntry();
        combatLogEvent.addEntry(result);
        this._doDamage({ shooterPosition: attackPosition, ...payload }, result);
      }
    }
  }
}

export default MSVTorpedoDamageStrategy;
