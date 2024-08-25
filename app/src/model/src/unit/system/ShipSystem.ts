import SystemDamage, { SerializedSystemDamage } from "./SystemDamage";
import SystemPower, { SerializedSystemPower } from "./SystemPower";
import SystemHeat, { SerializedSystemHeat } from "./SystemHeat";
import ShipSystemStrategy from "./strategy/ShipSystemStrategy";
import {
  SYSTEM_HANDLERS,
  SystemMessage,
} from "./strategy/types/SystemHandlersTypes";
import ShipSystems from "../ShipSystems";
import DamageEntry from "./DamageEntry";
import Critical from "./criticals/Critical";
import ShipSystemLog, {
  SerializedShipSystemLog,
} from "./ShipSystemLog/ShipSystemLog";
import ShipSystemLogEntryDamage from "./ShipSystemLog/ShipSystemLogEntryDamage";
import { SystemHandlers } from "../ShipSystemHandlers";

export type SerializedShipSystem = {
  power?: SerializedSystemPower;
  damage?: SerializedSystemDamage;
  heat?: SerializedSystemHeat;
  log?: SerializedShipSystemLog;
};

export type SystemArgs = {
  id: number;
  hitpoints?: number;
  armor?: number;
};

class ShipSystem {
  public id: number;
  public hitpoints: number;
  public armor: number;
  public strategies: ShipSystemStrategy[] = [];
  public power: SystemPower;
  public damage: SystemDamage;
  public shipSystems: null | ShipSystems;
  public heat: SystemHeat;
  public log: ShipSystemLog;
  public handlers: SystemHandlers;

  constructor(args: SystemArgs, strategies: ShipSystemStrategy[] = []) {
    this.id = args.id;
    this.hitpoints = args.hitpoints || 10;
    this.armor = args.armor || 0;
    this.strategies = strategies;
    this.handlers = new SystemHandlers(this);

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

  getShipSystems(): ShipSystems {
    if (!this.shipSystems) {
      throw new Error("ShipSystems not set");
    }

    return this.shipSystems;
  }

  getSystemDescription() {
    return "";
  }

  addStrategy(strategy: ShipSystemStrategy) {
    this.strategies.push(strategy);
    strategy.init(this);
  }

  addShipSystemsReference(shipSystems: ShipSystems) {
    this.shipSystems = shipSystems;
  }

  getSystemInfo(): SystemMessage[] {
    const heatMessages: SystemMessage[] = [];

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
      ...this.callHandler(SYSTEM_HANDLERS.getMessages, null, []),
    ];
  }

  getDisplayName(): string | null {
    return null;
  }

  getBackgroundImage(): string {
    return "";
  }

  getIconText() {
    return this.callHandler(SYSTEM_HANDLERS.getIconText, null, "");
  }

  isDestroyed() {
    return this.damage.isDestroyed();
  }

  isDisabled() {
    return this.power.isOffline() || this.isDestroyed();
  }

  getArmor() {
    const armorMod = this.callHandler(
      SYSTEM_HANDLERS.getArmorModifier,
      null,
      0
    );

    return this.armor + armorMod;
  }

  getRemainingHitpoints() {
    return this.hitpoints - this.getTotalDamage();
  }

  getTotalDamage() {
    return this.damage.getTotalDamage();
  }

  addDamage(damage: DamageEntry) {
    const shipWasDestroyed = this.shipSystems
      ? this.shipSystems.isDestroyed()
      : undefined;

    const systemWasDestroyed = this.isDestroyed();
    this.damage.addDamage(damage);

    if (!systemWasDestroyed && this.isDestroyed()) {
      damage.setDestroyedSystem();
    }

    const logEntry = this.log.getOpenLogEntryByClass<ShipSystemLogEntryDamage>(
      ShipSystemLogEntryDamage
    );
    logEntry.addDamage(damage);

    if (
      this.shipSystems &&
      shipWasDestroyed === false &&
      this.shipSystems.isDestroyed()
    ) {
      this.shipSystems.markDestroyedThisTurn();
    }
  }

  addCritical(critical: Critical) {
    this.damage.addCritical(critical);
  }

  hasAnyCritical() {
    return this.damage.hasAnyCritical();
  }

  hasCritical(name: typeof Critical | Critical | string) {
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

  getStrategiesByInstance<T extends ShipSystemStrategy>(instance: any): T[] {
    return this.strategies.filter(
      (strategy) => strategy instanceof instance
    ) as T[];
  }

  deserialize(data: SerializedShipSystem = {}) {
    this.damage.deserialize(data.damage);
    this.power.deserialize(data.power);
    this.heat.deserialize(data.heat);
    this.log.deserialize(data.log);
    this.callHandler(SYSTEM_HANDLERS.deserialize, data, undefined);

    return this;
  }

  serialize(): SerializedShipSystem {
    return {
      damage: this.damage.serialize(),
      power: this.power.serialize(),
      heat: this.heat.serialize(),
      log: this.log.serialize(),
      ...this.callHandler(SYSTEM_HANDLERS.serialize, null, {}),
    };
  }

  endTurn(turn: number) {
    this.log.endTurn(turn);
  }

  advanceTurn(turn: number) {
    this.damage.advanceTurn(turn);
    this.power.advanceTurn(turn);
    this.heat.advanceTurn(turn);
    this.log.advanceTurn(turn);
    this.callHandler(SYSTEM_HANDLERS.advanceTurn, turn, undefined);
  }

  isWeapon() {
    return false;
  }

  showOnSystemList() {
    return false;
  }
}

export default ShipSystem;
