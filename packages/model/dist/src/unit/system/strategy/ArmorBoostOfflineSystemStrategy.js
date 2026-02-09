import ShipSystemStrategy from "./ShipSystemStrategy";
class ArmorBoostOfflineSystemStrategy extends ShipSystemStrategy {
    armorBoost;
    constructor(armorBoost = 1) {
        super();
        this.armorBoost = armorBoost;
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
export default ArmorBoostOfflineSystemStrategy;
