import StandardDamageStrategy from "../../../../strategy/weapon/StandardDamageStrategy.mjs";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.mjs";

class MSVTorpedoDamageStrategy extends StandardDamageStrategy {
  constructor(
    damageFormula,
    armorPiercingFormula,
    rangePenalty,
    numberOfShots,
    strikeHitChange = 20
  ) {
    super(damageFormula, armorPiercingFormula);
    this.rangePenalty = rangePenalty;
    this.numberOfShots = numberOfShots;
    this.strikeHitChange = strikeHitChange;
  }

  _getDamageForWeaponHit({ torpedoFlight }) {
    if (Number.isInteger(this.damageFormula)) {
      return Math.ceil(this.damageFormula * torpedoFlight.strikeEffectiveness);
    }
    return Math.ceil(
      this.diceRoller.roll(this.damageFormula).total *
        torpedoFlight.strikeEffectiveness
    );
  }

  _getArmorPiercing({ torpedoFlight }) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return Math.round(
        this.armorPiercingFormula * torpedoFlight.strikeEffectiveness
      );
    }

    return Math.round(
      this.diceRoller.roll(this.armorPiercingFormula).total *
        torpedoFlight.strikeEffectiveness
    );
  }

  getHitChange({ target, torpedoFlight, distance }) {
    const hitProfile = target.getHitProfile(torpedoFlight.launchPosition);
    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10) * distance;

    return hitProfile - rangeModifier;
  }

  getStrikeDistance(payload) {
    let distance = 11;

    while (distance--) {
      if (this.getHitChange({ ...payload, distance }) >= this.strikeHitChange) {
        return distance;
      }
    }

    return 1;
  }

  applyDamageFromWeaponFire(payload) {
    const { torpedoFlight, combatLogEvent } = payload;
    const attackPosition = torpedoFlight.launchPosition;

    let shots = this.numberOfShots;

    const distance = this.getStrikeDistance(payload);
    const hitChance = this.getHitChange({ ...payload, distance });

    combatLogEvent.addNote(
      `MSV with ${this.numberOfShots} projectiles at distance ${distance} with hit chance of ${hitChance}% each.`
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
