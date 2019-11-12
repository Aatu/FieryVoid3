import StandardDamageStrategy from "./StandardDamageStrategy.mjs";

class ExplosiveDamageStrategy extends StandardDamageStrategy {
  constructor(damageFormula, armorPiercingFormula, numberOfDamagesFormula = 1) {
    super(damageFormula, armorPiercingFormula);

    this.numberOfDamagesFormula = numberOfDamagesFormula;
  }

  _getNumberOfDamagesForWeaponHit() {
    if (Number.isInteger(this.numberOfDamagesFormula)) {
      return this.numberOfDamagesFormula;
    }
    return this.diceRoller.roll(this.numberOfDamagesFormula).total;
  }

  _doDamage(payload, damageIds = [], lastSection) {
    const { target, shooter } = payload;

    let numberOfDamages = this._getNumberOfDamagesForWeaponHit();

    while (numberOfDamages--) {
      const hitSystem = this._chooseHitSystem({
        target,
        shooter
      });

      let result = this._doDamageToSystem(
        payload,
        hitSystem,
        this._getArmorPiercing(),
        this._getDamageForWeaponHit(payload)
      );

      if (result.damageEntry) {
        damageIds.push(result.damageEntry);
      }
    }
  }
}

export default ExplosiveDamageStrategy;
