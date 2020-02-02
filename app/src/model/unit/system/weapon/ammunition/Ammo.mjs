import CargoEntity from "../../cargo/CargoEntity.mjs";

class Ammo extends CargoEntity {
  constructor(damageFormula, armorPiercingFormula) {
    super();
    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
  }

  getDamage(diceRoller) {
    if (Number.isInteger(this.damageFormula)) {
      return this.armorPiercingFormula;
    }

    return diceRoller.roll(this.damageFormula).total;
  }

  getArmorPiercing(diceRoller) {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return this.armorPiercingFormula;
    }

    return diceRoller.roll(this.armorPiercingFormula).total;
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        header: "Damage",
        value: this.damageFormula
      },
      {
        header: "Armor piercing",
        value: this.armorPiercingFormula
      },
      ...previousResponse
    ];
  }

  getIconText() {
    return "";
  }
}

export default Ammo;
