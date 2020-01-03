import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class ArmorBoostOfflineSystemStrategy extends ShipSystemStrategy {
  constructor(armorBoost = 1) {
    super();

    this.armorBoost = armorBoost;
  }

  getArmorModifier(payload, previousResponse = 0) {
    if (!this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.armorBoost;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Increased armor when offline",
      value: `+${this.armorBoost}`
    });

    return previousResponse;
  }
}

export default ArmorBoostOfflineSystemStrategy;
