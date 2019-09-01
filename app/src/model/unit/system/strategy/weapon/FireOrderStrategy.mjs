import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import FireOrder from "../../../../weapon/FireOrder.mjs";

class FireOrderStrategy extends ShipSystemStrategy {
  constructor(numberOfShots = 1) {
    super();

    this.numberOfShots = numberOfShots;

    this.fireOrders = [];
  }

  executeFireOrders({ gameData }) {
    this.fireOrders.forEach(fireOrder => {
      const weapon = this.system;
      const shooter = gameData.ships.getShipById(fireOrder.shooterId);
      const target = gameData.ships.getShipById(fireOrder.targetId);
      const weaponSettings = fireOrder.weaponSettings;

      if (
        weapon.callHandler("checkFireOrderHits", {
          shooter,
          target,
          weaponSettings,
          gameData
        })
      ) {
        weapon.callHandler("applyDamageFromWeaponFire", {
          shooter,
          target,
          weaponSettings,
          gameData,
          fireOrder
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

  removeFireOrders() {
    this.fireOrders = [];
  }

  addFireOrder({ shooter, target, weaponSettings }) {
    if (this.fireOrders.length === this.numberOfShots) {
      throw new Error(
        `Can only assign ${this.numberOfShots} fire orders for this system`
      );
    }
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
    this.removeFireOrders();
  }

  censorForUser({ mine }) {
    if (!mine) {
      this.fireOrders = [];
    }
  }
}

export default FireOrderStrategy;
