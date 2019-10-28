import Ship from "../unit/Ship.mjs";
import ShipSystem from "../unit/system/ShipSystem.mjs";
import FireOrderResult from "./FireOrderResult.mjs";

class FireOrder {
  constructor(shooterId, targetId, weaponId, turn, weaponSettigs = {}) {
    this.id = null;
    this.turn = turn;
    this.shooterId = shooterId instanceof Ship ? shooterId.id : shooterId;
    this.targetId = shooterId instanceof Ship ? targetId.id : targetId;
    this.weaponId = weaponId instanceof ShipSystem ? weaponId.id : weaponId;
    this.weaponSettigs = weaponSettigs;
    this.result = null;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setResult(result) {
    this.result = result;
  }

  serialize() {
    return {
      id: this.id,
      turn: this.turn,
      shooterId: this.shooterId,
      targetId: this.targetId,
      weaponId: this.weaponId,
      weaponSettigs: this.weaponSettigs,
      result: this.result ? this.result.serialize() : null
    };
  }

  deserialize(data = {}) {
    this.id = data.id || null;
    this.turn = data.turn;
    this.shooterId = data.shooterId;
    this.targetId = data.targetId;
    this.weaponId = data.weaponId;
    this.weaponSettigs = data.weaponSettigs || {};
    this.result = data.result ? new FireOrderResult(data.result) : null;

    return this;
  }
}

export default FireOrder;
