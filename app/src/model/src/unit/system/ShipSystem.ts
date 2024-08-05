import SystemDamage from "./SystemDamage";
import SystemPower from "./SystemPower";
import SystemHeat from "./SystemHeat";
import ShipSystemLog from "./ShipSystemLog/ShipSystemLog.mjs";
import ShipSystemLogEntryDamage from "./ShipSystemLog/ShipSystemLogEntryDamage.mjs";
import { formatNumber } from "../../utils/format.mjs";
import ShipSystemStrategy from "./strategy/ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./strategy/types/SystemHandlersTypes";

type SerializedShipSystem = Record<string, unknown> & {
  power: Record<string, unknown>;
};

export type SystemArgs = {
  id: number;
  hitpoints: number;
  armor?: number;
};

class ShipSystem {
  public id: number;
  public hitpoints: number;
  public armor: number;
  public strategies: ShipSystemStrategy[] = [];
  private power: SystemPower;
  private damage: SystemDamage;

  constructor(args: SystemArgs, strategies = []) {
    this.id = args.id;
    this.hitpoints = args.hitpoints;
    this.armor = args.armor || 0;
    this.strategies = strategies;

    if (!this.hitpoints) {
      throw new Error("System must have hitpoints");
    }

    this.strategies.forEach((strategy) => strategy.init(this));

    this.damage = new SystemDamage(this);
    this.power = new SystemPower(this);

    this.shipSystems = null;

    this.heat = new SystemHeat(this);
    this.log = new ShipSystemLog(this);
  }

  getSystemDescription() {
    return "";
  }

  addStrategy(strategy: ShipSystemStrategy) {
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
          component: "SystemHeatBar",
          props: {
            currentOverheat: this.heat.getOverheatPercentage(),
            prediction: this.heat.predictHeatChange(),
          },
        });
      }
    }

    return [
      {
        sort: "AAA",
        value: [
          {
            header: "Hitpoints",
            value: `${this.getRemainingHitpoints()}/${this.hitpoints}`,
          },
          { header: "Armor", value: `${this.getArmor()}` },
        ],
      },
      ...heatMessages,
      ...this.callHandler("getMessages", null, []),
    ];
  }

  getDisplayName(): string | null {
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

    const logEntry = this.log.getOpenLogEntryByClass(ShipSystemLogEntryDamage);
    logEntry.addDamage(damage);

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

  callHandler<T extends unknown>(
    name: SYSTEM_HANDLERS,
    payload: unknown = {},
    response: T
  ) {
    this.strategies.forEach((strategy) => {
      response = strategy.callHandler<T>(name, payload, response);
    });

    return response;
  }

  getStrategiesByInstance<T extends ShipSystemStrategy>(
    instance: typeof ShipSystemStrategy
  ): T[] {
    return this.strategies.filter(
      (strategy) => strategy instanceof instance
    ) as T[];
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
      ...this.callHandler("serialize"),
    };
  }

  endTurn(turn) {
    this.log.endTurn(turn);
  }

  advanceTurn(turn) {
    this.damage.advanceTurn(turn);
    this.power.advanceTurn(turn);
    this.heat.advanceTurn(turn);
    this.log.advanceTurn(turn);
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
