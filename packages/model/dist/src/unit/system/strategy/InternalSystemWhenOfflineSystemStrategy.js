import { ShipSystemType } from "../ShipSystem";
import ShipSystemStrategy from "./ShipSystemStrategy";
class InternalSystemWhenOfflineSystemStrategy extends ShipSystemStrategy {
    armorBoost;
    constructor(armorBoost = 1) {
        super();
        this.armorBoost = armorBoost;
    }
    getShipSystemType(payload, previousResponse) {
        if (!this.getSystem().isDisabled()) {
            return previousResponse;
        }
        return ShipSystemType.INTERNAL;
    }
    getArmorModifier(_, previousResponse = 0) {
        if (!this.getSystem().isDisabled()) {
            return previousResponse;
        }
        return previousResponse + this.armorBoost;
    }
    getMessages(_, previousResponse = []) {
        previousResponse.push({
            header: "Increased armor when offline",
            value: `+${this.armorBoost}`,
        });
        return previousResponse;
    }
}
export default InternalSystemWhenOfflineSystemStrategy;
