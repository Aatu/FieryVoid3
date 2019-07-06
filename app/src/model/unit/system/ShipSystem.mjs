import SystemDamage from "./SystemDamage";
import SystemPower from "./SystemPower";

class ShipSystem {
  constructor(args = {}) {
    this.id = args.id;
    this.hitpoints = args.hitpoints;
    this.armor = args.armor;
    this.strategies = [];
    this.damage = new SystemDamage(this);
    this.power = new SystemPower(this);
  }

  getSystemInfo(ship) {
    return [
      {
        header: "Hitpoints",
        value: `${this.getRemainingHitpoints()}/${this.hitpoints}`
      },
      { header: "Armor", value: `${this.getArmor()}` },
      ...this.callHandler("getMessages", null, [])
    ];
  }

  getDisplayName() {
    return null;
  }

  getBackgroundImage() {
    return null;
  }

  getIconText() {
    return null;
  }

  isDestroyed() {
    return this.damage.isDestroyed();
  }

  isDisabled() {
    return this.power.isOffline() || this.isDestroyed();
  }

  getArmor() {
    return this.armor;
  }

  getRemainingHitpoints() {
    return this.hitpoints - this.getTotalDamage();
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

  hasAnyCritical() {
    return this.damage.hasAnyCritical();
  }

  hasCritical(name) {
    return this.damage.hasCritical(name);
  }

  callHandler(name, payload = {}, response = undefined) {
    this.strategies.forEach(strategy => {
      response = strategy.callHandler(name, this, payload, response);
    });

    return response;
  }

  deserialize(data = {}) {
    this.damage.deserialize(data.damage);
    this.power.deserialize(data.power);
    return this;
  }

  serialize() {
    return {
      damage: this.damage.serialize(),
      power: this.power.serialize()
    };
  }

  advanceTurn() {
    this.damage.advanceTurn();
    this.power.advanceTurn();
    this.callHandler("advanceTurn");
  }
}

export default ShipSystem;
