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

  _getDamageForWeaponHit({ torpedoFlight, relativeVelocity }) {
    if (Number.isInteger(this.damageFormula)) {
      return (
        this.damageFormula *
        torpedoFlight.getRelativeVelocityRatio(relativeVelocity)
      );
    }
    return (
      this.diceRoller.roll(this.damageFormula).total *
      torpedoFlight.getRelativeVelocityRatio(relativeVelocity)
    );
  }

  _getArmorPiercing({ torpedoFlight, relativeVelocity }) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return (
        this.armorPiercingFormula *
        torpedoFlight.getRelativeVelocityRatio(relativeVelocity)
      );
    }

    return (
      this.diceRoller.roll(this.armorPiercingFormula).total *
      torpedoFlight.getRelativeVelocityRatio(relativeVelocity)
    );
  }

  applyDamageFromWeaponFire(payload) {
    const { torpedoFlight, target, combatLogEvent } = payload;
    const attackPosition = torpedoFlight.position;
    const hitProfile = target.getHitProfile(attackPosition);

    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10);

    let shots = this.numberOfShots;

    const hitChance = hitProfile - rangeModifier;

    combatLogEvent.addNote(
      `MSV with ${this.numberOfShots} projectiles with hit chance of ${hitChance}% each.`
    );

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitChance;

      if (hit) {
        const result = new CombatLogDamageEntry();
        combatLogEvent.addDamage(result);
        this._doDamage({ shooterPosition: attackPosition, ...payload }, result);
      }
    }
  }
}

export default MSVTorpedoDamageStrategy;
