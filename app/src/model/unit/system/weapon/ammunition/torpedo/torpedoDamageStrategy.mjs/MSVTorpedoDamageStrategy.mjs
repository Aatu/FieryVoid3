import StandardDamageStrategy from "../../../../strategy/weapon/StandardDamageStrategy.mjs";
import CombatLogDamageResultEntry from "../../../../../../combatLog/CombatLogDamageResultEntry.mjs";

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
      return this.damageFormula;
    }
    return (
      this.diceRoller.roll(this.damageFormula).total *
      torpedoFlight.getRelativeVelocityRatio()
    );
  }

  applyDamageFromWeaponFire(payload) {
    const { torpedoFlight, target } = payload;

    const attackPosition = torpedoFlight.position;
    const hitProfile = target.getHitProfile(attackPosition);

    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10);

    let shots = this.numberOfShots;

    if (hit) {
    }

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitProfile - rangeModifier;

      if (hit) {
        const result = new CombatLogDamageResultEntry();
        this._doDamage({ shooterPosition: attackPosition, ...payload }, result);
      }
    }
  }
}

export default MSVTorpedoDamageStrategy;
