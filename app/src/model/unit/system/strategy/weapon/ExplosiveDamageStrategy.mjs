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

  _doDamage(payload, damageResult) {
    const { target, shooterPosition } = payload;

    let numberOfDamages = this._getNumberOfDamagesForWeaponHit();

    while (numberOfDamages--) {
      const hitSystem = this._chooseHitSystem({
        target,
        shooterPosition
      });

      if (!hitSystem) {
        return;
      }

      this._doDamageToSystem(
        payload,
        damageResult,
        hitSystem,
        this._getArmorPiercing(),
        this._getDamageForWeaponHit(payload)
      );
    }
  }
}

export default ExplosiveDamageStrategy;
