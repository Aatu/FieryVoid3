import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import FireOrder from "../../../../weapon/FireOrder.mjs";

class FireOrderStrategy extends ShipSystemStrategy {
  constructor(numberOfShots) {
    super();

    this.numberOfShots = numberOfShots;

    this.fireOrders = [];
  }

  executeFireOrders({ gameData }) {
    this.fireOrders.forEach(fireOrder => {
      const weapon = this.system;

      if (
        weapon.callHandler("checkFireOrderHits", {
          fireOrder,
          gameData
        })
      ) {
        weapon.callHandler("applyDamageFromWeaponFire", {
          fireOrder,
          gameData
        });
      }
    });
  }

  getNumberOfShots() {
    return this.numberOfShots;
  }

  getFireOrders() {
    return this.fireOrders;
  }

  addFireOrder({ shooter, target, weaponSettings }) {
    const order = new FireOrder(shooter, target, this.system, weaponSettings);
    this.fireOrders.push(order);
    return order;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      fireOrderStrategy: this.fireOrders.map(fire => fire.serialize())
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

  censorForUser({ mine }) {
    if (!mine) {
      this.fireOrders = [];
    }
  }
}

export default FireOrderStrategy;
