import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class FireOrderHeatStrategy extends ShipSystemStrategy {
  constructor(heatPerFireOrder) {
    super();
    this.heatPerFireOrder = heatPerFireOrder;
  }

  generatesHeat() {
    return true;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      sort: "heat",
      header: "Generates heat when fired",
      value: `${this.heatPerFireOrder}`
    });

    return previousResponse;
  }

  getHeatGenerated(payload, previousResponse = 0) {
    const fireOrders = this.system.callHandler("getFireOrders", null, []);

    if (fireOrders.length === 0) {
      return previousResponse;
    }

    return previousResponse + fireOrders * this.heatPerFireOrder;
  }
}

export default FireOrderHeatStrategy;
