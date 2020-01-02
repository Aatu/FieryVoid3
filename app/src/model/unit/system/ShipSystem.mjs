import SystemDamage from "./SystemDamage.mjs";
import SystemPower from "./SystemPower.mjs";

class ShipSystem {
  constructor(args = {}, strategies = []) {
    this.id = args.id;
    this.hitpoints = args.hitpoints;
    this.armor = args.armor;
    this.strategies = strategies;

    this.strategies.forEach(strategy => strategy.init(this));

    this.damage = new SystemDamage(this);
    this.power = new SystemPower(this);

    this.shipSystems = null;

    //this.wasDisabledBeforeResolution = null;
  }

  /*
  setDisabledStateBeforeResolution() {
    this.wasDisabledBeforeResolution = this.isDisabled();
  }

  wasDisabled() {
    return this.wasDisabledBeforeResolution;
  }

  */

  addShipSystemsReference(shipSystems) {
    this.shipSystems = shipSystems;
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
    const armorMod = this.callHandler("applyArmorPiercing");
    if (armorMod) {
      return this.armor + armorMod;
    }

    return this.armor;
  }

  getRemainingHitpoints() {
    return this.hitpoints - this.getTotalDamage();
  }

  getTotalDamage() {
    return this.damage.getTotalDamage();
  }

  addDamage(damage) {
    const shipWasDestroyed = this.shipSystems
      ? this.shipSystems.isDestroyed()
      : undefined;

    const systemWasDestroyed = this.isDestroyed();
    this.damage.addDamage(damage);

    if (!systemWasDestroyed && this.isDestroyed()) {
      damage.setDestroyedSystem();
    }

    if (
      this.shipSystems &&
      shipWasDestroyed === false &&
      this.shipSystems.isDestroyed()
    ) {
      this.shipSystems.markDestroyedThisTurn();
    }
  }

  rollCritical(damageEntry) {
    return this.damage.rollCritical(damageEntry);
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
      response = strategy.callHandler(name, payload, response);
    });

    return response;
  }

  getStrategiesByInstance(instance) {
    return this.strategies.filter(strategy => strategy instanceof instance);
  }

  deserialize(data = {}) {
    this.damage.deserialize(data.damage);
    this.power.deserialize(data.power);
    this.callHandler("deserialize", data);
    return this;
  }

  serialize() {
    return {
      damage: this.damage.serialize(),
      power: this.power.serialize(),
      ...this.callHandler("serialize")
    };
  }

  advanceTurn(turn) {
    this.damage.advanceTurn();
    this.power.advanceTurn();
    this.callHandler("advanceTurn", turn);
  }

  isWeapon() {
    return false;
  }

  showOnSystemList() {
    return false;
  }
}

export default ShipSystem;
