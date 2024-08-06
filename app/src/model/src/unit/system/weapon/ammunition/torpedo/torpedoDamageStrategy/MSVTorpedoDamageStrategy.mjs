import StandardDamageStrategy from "../../../../strategy/weapon/StandardDamageStrategy.js";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry.mjs";

class MSVTorpedoDamageStrategy extends StandardDamageStrategy {
  constructor(
    damageFormula,
    armorPiercingFormula,
    rangePenalty,
    numberOfShots,
    strikeHitChance = 20,
    minStrikeDistance = 1
  ) {
    super(damageFormula, armorPiercingFormula);
    this.rangePenalty = rangePenalty;
    this.numberOfShots = numberOfShots;
    this.strikeHitChance = strikeHitChance;
    this.minStrikeDistance = minStrikeDistance;
    this.msv = true;
  }

  getAttackRunMessages(payload, previousResponse = []) {
    return [
      {
        header: "Strike distance",
        value: this.getStrikeDistance(payload),
      },
    ];
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Number of SVs",
      value: this.numberOfShots,
    });

    previousResponse.push({
      header: "Damage per SV",
      value: this.damageFormula,
    });

    previousResponse.push({
      header: "Armor piercing per SV",
      value: this.armorPiercingFormula,
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

  _getDamageForWeaponHit({ torpedoFlight }) {
    if (Number.isInteger(this.damageFormula)) {
      return Math.ceil(this.damageFormula);
    }
    return Math.ceil(this.diceRoller.roll(this.damageFormula).total);
  }

  _getArmorPiercing({ torpedoFlight }) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return Math.round(this.armorPiercingFormula);
    }

    return Math.round(this.diceRoller.roll(this.armorPiercingFormula).total);
  }

  getHitChance({ target, torpedoFlight, distance }) {
    const hitProfile = target.getHitProfile(torpedoFlight.strikePosition);
    const rangeModifier =
      this.rangePenalty * (1 + target.movement.getEvasion() / 10) * distance;

    return hitProfile - rangeModifier;
  }

  getStrikeDistance(payload) {
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

  applyDamageFromWeaponFire(payload) {
    const { torpedoFlight, combatLogEvent } = payload;
    const attackPosition = torpedoFlight.strikePosition;

    let shots = this.numberOfShots;

    const distance = this.getStrikeDistance(payload);
    const hitChance = this.getHitChance({ ...payload, distance });

    combatLogEvent.addNote(
      `MSV with ${this.numberOfShots} projectiles at distance ${distance} with hit chance of ${hitChance}% each.`
    );

    let hits = 0;

    while (shots--) {
      const roll = Math.ceil(Math.random() * 100);
      const hit = roll <= hitChance;

      if (hit) {
        hits++;
        const result = new CombatLogDamageEntry();
        combatLogEvent.addDamage(result);
        this._doDamage({ shooterPosition: attackPosition, ...payload }, result);
      }
    }

    combatLogEvent.addNote(`${hits} MSVs hit target.`);
  }
}

export default MSVTorpedoDamageStrategy;
