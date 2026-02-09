import FireOrder from "../../../weapon/FireOrder";
import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class FireOrderHeatStrategy extends ShipSystemStrategy {
  private heatPerShot: number;

  constructor(heatPerShot: number) {
    super();
    this.heatPerShot = heatPerShot;
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

    if (fireOrders.length > 0) {
      return previousResponse + fireOrders.length * this.heatPerShot;
    }

    const intercepts = this.getSystem().handlers.getUsedIntercepts();

    if (intercepts > 0) {
      return previousResponse + intercepts * this.heatPerShot;
    }
  }
}

export default FireOrderHeatStrategy;
