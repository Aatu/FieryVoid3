import { DiceRoller } from "../../../../utils/DiceRoller.js";
import CargoEntity from "../../cargo/CargoEntity.js";
import { SystemMessage } from "../../strategy/types/SystemHandlersTypes.js";
import { AmmunitionType } from "./index.js";

class Ammo extends CargoEntity {
  public damageFormula: string | number;
  public armorPiercingFormula: string | number;

  constructor(
    damageFormula: string | number,
    armorPiercingFormula: string | number
  ) {
    super();
    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
  }

  getDamage(diceRoller: DiceRoller): number {
    if (Number.isInteger(this.damageFormula)) {
      return this.damageFormula as number;
    }

    return diceRoller.roll(this.damageFormula);
  }

  getArmorPiercing(diceRoller: DiceRoller): number {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return this.armorPiercingFormula as number;
    }

    return diceRoller.roll(this.armorPiercingFormula);
  }

  getCargoInfo(): SystemMessage[] {
    const previousResponse = super.getCargoInfo();

    return [
      {
        header: "Damage",
        value: this.damageFormula.toString(),
      },
      {
        header: "Armor piercing",
        value: this.armorPiercingFormula.toString(),
      },
      ...previousResponse,
    ];
  }

  getIconText() {
    return "";
  }

  getConstructorName(): AmmunitionType {
    return this.constructor.name as AmmunitionType;
  }
}

export default Ammo;
