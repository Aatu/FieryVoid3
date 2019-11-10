import StandardDamageStrategy from "./StandardDamageStrategy.mjs";

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

  applyDamageFromWeaponFire(payload) {
    const { fireOrder } = payload;
    const shots = this._getNumberOfShots(payload);

    fireOrder.result.setDetails({
      type: "applyDamageFromWeaponFire",
      shotsHit: shots,
      totalShots: this.maxShots,
      shots: Array.from(Array(shots)).map(() => this._doDamage(payload))
    });
  }

  _getNumberOfShots({ requiredToHit, rolledToHit }) {
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

    return shots;
  }
}

export default BurstDamageStrategy;
