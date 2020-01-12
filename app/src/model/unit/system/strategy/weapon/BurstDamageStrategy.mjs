import StandardDamageStrategy from "./StandardDamageStrategy.mjs";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry.mjs";

class BurstDamageStrategy extends StandardDamageStrategy {
  constructor(
    damageFormula,
    armorPiercingFormula,
    shotsFormula = 6,
    maxShots = 6,
    grouping = 10
  ) {
    super(damageFormula, armorPiercingFormula);

    this.shotsFormula = shotsFormula;
    this.maxShots = maxShots;
    this.grouping = grouping;
  }

  getTotalBurstSize() {
    return this.maxShots;
  }

  applyDamageFromWeaponFire(payload) {
    const { fireOrder, combatLogEntry } = payload;
    const shots = this._getNumberOfShots(payload);

    combatLogEntry.setShots(shots, this.maxShots);

    Array.from(Array(shots)).map(() => {
      const result = new CombatLogDamageEntry();
      combatLogEntry.addDamage(result);
      this._doDamage(
        { shooterPosition: payload.shooter.getPosition(), ...payload },
        result
      );
      return result;
    });
  }

  _getDamageTypeMessage() {
    return "Burst";
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Damage type",
      value: this._getDamageTypeMessage()
    });

    previousResponse.push({
      header: "Burst size",
      value: this.maxShots
    });

    previousResponse.push({
      header: "Burst grouping",
      value: this.grouping
    });

    previousResponse.push({
      header: "Damage",
      value: this._getDamageMessage()
    });

    previousResponse.push({
      header: "Armor piercing",
      value: this._getArmorPiercingMessage()
    });

    return previousResponse;
  }

  _getNumberOfShots({ hitResolution }) {
    const requiredToHit = hitResolution.hitChange.result;
    const rolledToHit = hitResolution.hitRoll;

    if (rolledToHit > requiredToHit) {
      return 0;
    }

    if (rolledToHit <= requiredToHit - this.maxShots * this.grouping) {
      return this.maxShots;
    }

    let shots = Math.floor((requiredToHit - rolledToHit) / this.grouping);

    if (Number.isInteger(this.shotsFormula)) {
      shots += this.shotsFormula;
    } else {
      shots += this.diceRoller.roll(this.shotsFormula).total;
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
