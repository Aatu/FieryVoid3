import SystemDamage from "./SystemDamage";

class ShipSystem {
  constructor(id, hitpoints, armor) {
    this.id = id;
    this.hitpoints = hitpoints;
    this.armor = armor;
    this.strategies = [];
    this.damage = new SystemDamage(this);
  }

  isDestroyed() {
    return this.damage.isDestroyed();
  }

  getTotalDamage() {
    return this.damage.getTotalDamage();
  }

  addDamage(damage) {
    this.damage.addDamage(damage);
  }

  addCritical(critical) {
    this.damage.addCritical(critical);
  }

  hasCritical(name) {
    return this.damage.hasCritical(name);
  }

  callHandler(name, payload = {}) {
    let response = {};

    this.strategies.forEach(strategy => {
      response = strategy.callHandler(name, this, payload, response);
    });

    return response;
  }

  deserialize(data = {}) {
    this.damage.deserialize(data.damage);
    return this;
  }

  serialize() {
    return {
      damage: this.damage.serialize()
    };
  }

  advanceTurn() {
    this.damage.advanceTurn();
    this.callHandler("advanceTurn");
  }
}

export default ShipSystem;
