import CargoEntity from "../../../../cargo/CargoEntity";
import { SystemMessage } from "../../strategy/types/SystemHandlersTypes";
import {
  IDamageOverrider,
  UnifiedDamageStrategyArgs,
} from "../../strategy/weapon/UnifiedDamageStrategy";
import { AmmunitionType } from "./index";

class Ammo extends CargoEntity implements IDamageOverrider {
  public damageArgs: UnifiedDamageStrategyArgs;

  constructor(args: UnifiedDamageStrategyArgs) {
    super();
    this.damageArgs = args;
  }

  getDamageOverrider(
    args: UnifiedDamageStrategyArgs
  ): UnifiedDamageStrategyArgs {
    return this.damageArgs;
  }

  getCargoInfo(): SystemMessage[] {
    const previousResponse = super.getCargoInfo();

    return [
      {
        header: "Damage",
        value: this.damageArgs.damageFormula.toString(),
      },
      {
        header: "Armor piercing",
        value: this.damageArgs.armorPiercingFormula.toString(),
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
