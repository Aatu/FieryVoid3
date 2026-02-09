import SystemDamage from "./SystemDamage";
import SystemPower from "./SystemPower";
import SystemHeat from "./SystemHeat";
import { SYSTEM_HANDLERS, } from "./strategy/types/SystemHandlersTypes";
import ShipSystemLog from "./ShipSystemLog/ShipSystemLog";
import ShipSystemLogEntryDamage from "./ShipSystemLog/ShipSystemLogEntryDamage";
import { SystemHandlers } from "../ShipSystemHandlers";
export var ShipSystemType;
(function (ShipSystemType) {
    ShipSystemType["INTERNAL"] = "internal";
    ShipSystemType["EXTERNAL"] = "external";
    ShipSystemType["STRUCTURE"] = "structure";
})(ShipSystemType || (ShipSystemType = {}));
class ShipSystem {
    id;
    hitpoints;
    armor;
    strategies = [];
    power;
    damage;
    shipSystems;
    heat;
    log;
    handlers;
    constructor(args, strategies = []) {
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
    getShip() {
        return this.getShipSystems().ship;
    }
    getStructure() {
        return this.getShipSystems().getStructureForSystem(this);
    }
    getSection() {
        const section = this.getShipSystems().getSectionForSystem(this);
        if (!section) {
            throw new Error("Every system must be in a section");
        }
        return section;
    }
    getSystemType() {
        const value = ShipSystemType.INTERNAL;
        return this.handlers.getShipSystemType(value);
    }
    getShipSystems() {
        if (!this.shipSystems) {
            throw new Error("ShipSystems not set");
        }
        return this.shipSystems;
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
    getSystemInfo() {
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
            {
                header: "ID",
                value: this.id,
            },
            ...heatMessages,
            ...this.callHandler(SYSTEM_HANDLERS.getMessages, null, []),
        ];
    }
    getDisplayName() {
        return null;
    }
    getBackgroundImage() {
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
        const armorMod = this.callHandler(SYSTEM_HANDLERS.getArmorModifier, null, 0);
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
        if (this.shipSystems &&
            shipWasDestroyed === false &&
            this.shipSystems.isDestroyed()) {
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
    callHandler(name, payload = {}, response) {
        this.strategies.forEach((strategy) => {
            response = strategy.callHandler(name, payload, response);
        });
        return response;
    }
    getStrategiesByInstance(instance) {
        return this.strategies.filter((strategy) => strategy instanceof instance);
    }
    deserialize(data = {}) {
        this.damage.deserialize(data.damage);
        this.power.deserialize(data.power);
        this.heat.deserialize(data.heat);
        this.log.deserialize(data.log);
        this.handlers.deserialize(data);
        return this;
    }
    serialize() {
        return {
            damage: this.damage.serialize(),
            power: this.power.serialize(),
            heat: this.heat.serialize(),
            log: this.log.serialize(),
            ...this.handlers.serialize(),
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
