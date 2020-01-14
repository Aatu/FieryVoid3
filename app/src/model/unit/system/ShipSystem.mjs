import SystemDamage from "./SystemDamage.mjs";
import SystemPower from "./SystemPower.mjs";
import SystemHeat from "./SystemHeat.mjs";
import ShipSystemLog from "./ShipSystemLog/ShipSystemLog.mjs";

class ShipSystem {
  constructor(args = {}, strategies = []) {
    this.id = args.id;
    this.hitpoints = args.hitpoints;
    this.armor = args.armor || 0;
    this.strategies = strategies;

    if (!this.hitpoints) {
      throw new Error("System must have hitpoints");
    }

    this.strategies.forEach(strategy => strategy.init(this));

    this.damage = new SystemDamage(this);
    this.power = new SystemPower(this);

    this.shipSystems = null;

    this.heat = new SystemHeat(this);
    this.log = new ShipSystemLog(this);
  }

  getSystemDescription() {
    return "";
  }

  addStrategy(strategy) {
    this.strategies.push(strategy);
    strategy.init(this);
  }

  addShipSystemsReference(shipSystems) {
    this.shipSystems = shipSystems;
  }

  getSystemInfo(ship) {
    const heatMessages = [];

    if (this.heat.shouldDisplayHeat()) {
      if (!this.heat.isHeatStorage()) {
        heatMessages.push({
          sort: "heat",
          value: [
            {
              header: "Overheat",
              value: `${this.heat.getOverheat()}/${this.heat.getOverheatTreshold()} (${this.heat.getOverheatPercentage()}%)`
            },
            {
              header: "Cooling",
              value: this.heat.getMaxTransferHeat()
            }
          ]
        });
      }
    }

    return [
      {
        sort: "AAA",
        value: [
          {
            header: "Hitpoints",
            value: `${this.getRemainingHitpoints()}/${this.hitpoints}`
          },
          { header: "Armor", value: `${this.getArmor()}` }
        ]
      },
      ...heatMessages,
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
    return this.callHandler("getIconText", null, "");
  }

  isDestroyed() {
    return this.damage.isDestroyed();
  }

  isDisabled() {
    return this.power.isOffline() || this.isDestroyed();
  }

  getArmor() {
    const armorMod = this.callHandler("getArmorModifier", null, 0);

    return this.armor + armorMod;
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
    this.heat.deserialize(data.heat);
    this.log.deserialize(data.log);
    this.callHandler("deserialize", data);

    return this;
  }

  serialize() {
    return {
      damage: this.damage.serialize(),
      power: this.power.serialize(),
      heat: this.heat.serialize(),
      log: this.log.serialize(),
      ...this.callHandler("serialize")
    };
  }

  advanceTurn(turn) {
    this.damage.advanceTurn();
    this.power.advanceTurn();
    this.heat.advanceTurn();
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
