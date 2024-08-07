import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class FireOrderHeatStrategy extends ShipSystemStrategy {
  private heatPerFireOrder: number;

  constructor(heatPerFireOrder: number) {
    super();
    this.heatPerFireOrder = heatPerFireOrder;
  }

  generatesHeat() {
    return true;
  }

  getMessages(payload: unknown, previousResponse = []) {
    return previousResponse;
  }

  getHeatGenerated(payload: unknown, previousResponse = 0) {
    const fireOrders = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getFireOrders,
      null,
      [] as FireOrder[]
    );

    if (fireOrders.length === 0) {
      return previousResponse;
    }

    return previousResponse + fireOrders.length * this.heatPerFireOrder;
  }
}

export default FireOrderHeatStrategy;
