import { DiceRoller } from "../../../../utils/DiceRoller";
import CargoEntity from "../../cargo/CargoEntity";
import { SystemMessage } from "../../strategy/types/SystemHandlersTypes";
import { AmmunitionType } from "./index";

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
