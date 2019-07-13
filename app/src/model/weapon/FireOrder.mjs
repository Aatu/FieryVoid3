import Ship from "../unit/Ship.mjs";
import ShipSystem from "../unit/system/ShipSystem.mjs";

class FireOrder {
  constructor(shooterId, targetId, weaponId, weaponSettigs = {}) {
    this.id = null;
    this.shooterId = shooterId instanceof Ship ? shooterId.id : shooterId;
    this.targetId = shooterId instanceof Ship ? targetId.id : targetId;
    this.weaponId = weaponId instanceof ShipSystem ? weaponId.id : weaponId;
    this.weaponSettigs = weaponSettigs;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  serialize() {
    return {
      id: this.id,
      shooterId: this.shooterId,
      targetId: this.targetId,
      weaponId: this.weaponId,
      weaponSettigs: this.weaponSettigs
    };
  }

  deserialize(data = {}) {
    this.id = data.id || null;
    this.shooterId = data.shooterId;
    this.targetId = data.targetId;
    this.weaponId = data.weaponId;
    this.weaponSettigs = data.weaponSettigs || {};

    return this;
  }
}

export default FireOrder;
