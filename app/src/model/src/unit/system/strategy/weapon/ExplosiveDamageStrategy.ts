import StandardDamageStrategy from "./StandardDamageStrategy.js";

class ExplosiveDamageStrategy extends StandardDamageStrategy {
  constructor(damageFormula, armorPiercingFormula, numberOfDamagesFormula = 1) {
    super(damageFormula, armorPiercingFormula);

    this.numberOfDamagesFormula = numberOfDamagesFormula;
  }

  _getDamageTypeMessage() {
    return "Explosive";
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Damage type",
      value: this._getDamageTypeMessage(),
    });

    previousResponse.push({
      header: "Number of hits",
      value: this.numberOfDamagesFormula,
    });

    previousResponse.push({
      header: "Damage per hit",
      value: this._getDamageMessage(),
    });

    previousResponse.push({
      header: "Armor piercing per hit",
      value: this._getArmorPiercingMessage(),
    });

    return previousResponse;
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
        shooterPosition,
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
