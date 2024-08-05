import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

class ArmorBoostOfflineSystemStrategy extends ShipSystemStrategy {
  private armorBoost: number;

  constructor(armorBoost = 1) {
    super();

    this.armorBoost = armorBoost;
  }

  getArmorModifier(_: unknown, previousResponse = 0) {
    if (!this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.armorBoost;
  }

  public getMessages(
    _: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Increased armor when offline",
      value: `+${this.armorBoost}`,
    });

    return previousResponse;
  }
}

export default ArmorBoostOfflineSystemStrategy;
