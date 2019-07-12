import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";

class FireOrder {
  constructor(shooterId, targetId, weaponId, weaponSettigs) {
    this.shooterId = shooterId instanceof Ship ? shooterId.id : shooterId;
    this.targetId = shooterId instanceof Ship ? targetId.id : targetId;
    this.weaponId = weaponId instanceof ShipSystem ? weaponId.id : weaponId;
    this.weaponSettigs = weaponSettigs;
  }

  serialize() {
    return {
      shooterId: this.shooterId,
      targetId: this.targetId,
      weaponId: this.weaponId,
      weaponSettigs: this.weaponSettigs
    };
  }

  deserialize(data = {}) {
    this.shooterId = data.shooterId;
    this.targetId = data.targetId;
    this.weaponId = data.weaponId;
    this.weaponSettigs = data.weaponSettigs || {};

    return this;
  }
}

export default FireOrder;
