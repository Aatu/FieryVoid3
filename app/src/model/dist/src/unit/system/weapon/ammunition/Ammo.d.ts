import CargoEntity from "../../../../cargo/CargoEntity";
import { SystemMessage } from "../../strategy/types/SystemHandlersTypes";
import { IDamageOverrider, UnifiedDamageStrategyArgs } from "../../strategy/weapon/UnifiedDamageStrategy";
import { AmmunitionType } from "./index";
declare class Ammo extends CargoEntity implements IDamageOverrider {
    damageArgs: UnifiedDamageStrategyArgs;
    constructor(args: UnifiedDamageStrategyArgs);
    getDamageOverrider(args: UnifiedDamageStrategyArgs): UnifiedDamageStrategyArgs;
    getCargoInfo(): SystemMessage[];
    getIconText(): string;
    getConstructorName(): AmmunitionType;
}
export default Ammo;
