import { ShipSystemType } from "../ShipSystem";
import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

class InternalSystemWhenOfflineSystemStrategy extends ShipSystemStrategy {
  private armorBoost: number;

  constructor(armorBoost = 1) {
    super();

    this.armorBoost = armorBoost;
  }

  getShipSystemType(
    payload: undefined,
    previousResponse: ShipSystemType
  ): ShipSystemType {
    if (!this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return ShipSystemType.INTERNAL;
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

export default InternalSystemWhenOfflineSystemStrategy;
