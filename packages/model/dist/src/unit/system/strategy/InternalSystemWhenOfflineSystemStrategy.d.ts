import { ShipSystemType } from "../ShipSystem";
import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
declare class InternalSystemWhenOfflineSystemStrategy extends ShipSystemStrategy {
    private armorBoost;
    constructor(armorBoost?: number);
    getShipSystemType(payload: undefined, previousResponse: ShipSystemType): ShipSystemType;
    getArmorModifier(_: unknown, previousResponse?: number): number;
    getMessages(_: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
}
export default InternalSystemWhenOfflineSystemStrategy;
