import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
declare class ArmorBoostOfflineSystemStrategy extends ShipSystemStrategy {
    private armorBoost;
    constructor(armorBoost?: number);
    getArmorModifier(_: unknown, previousResponse?: number): number;
    getMessages(_: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
}
export default ArmorBoostOfflineSystemStrategy;
