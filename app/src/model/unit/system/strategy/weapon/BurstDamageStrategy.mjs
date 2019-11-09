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
    console.log(
      "requiredToHit",
      requiredToHit,
      "requiredToHit",
      rolledToHit,
      this.grouping
    );

    if (rolledToHit <= requiredToHit - this.maxShots * this.grouping) {
      console.log("return max shots", this.maxShots);
      return this.maxShots;
    }

    let shots = Math.floor((requiredToHit - rolledToHit) / this.grouping);
    console.log("initial shots", shots);

    if (Number.isInteger(this.shotsFormula)) {
      shots += this.shotsFormula;
      console.log("shotsFormula is number", shots);
    } else {
      shots += this.diceRoller.roll(this.shotsFormula).total;
      console.log("shotsFormula is NOT number", shots);
    }

    if (shots > this.maxShots) {
      console.log("shots are over masx", shots);
      shots = this.maxShots;
    }

    console.log("shots are", shots);
    return shots;
  }
}

export default BurstDamageStrategy;
