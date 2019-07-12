import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import FireOrder from "../../../../weapon/FireOrder.mjs";

class FireOrderStrategy extends ShipSystemStrategy {
  constructor() {
    super();

    this.fireOrders = [];
  }

  getFireOrders() {
    return this.fireOrders;
  }

  addFireOrder({ shooter, target, weaponSettings }) {
    this.fireOrders.push(
      new FireOrder(shooter, target, this.system, weaponSettings)
    );
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      fireOrderStrategy: [this.fireOrders.map(fire => fire.serialize())]
    };
  }

  deserialize(data = {}) {
    this.fireOrders = data.fireOrderStrategy
      ? data.fireOrderStrategy.map(entry => new FireOrder().deserialize(entry))
      : [];

    return this;
  }

  advanceTurn() {
    this.fireOrders = [];
  }
}

export default FireOrderStrategy;
