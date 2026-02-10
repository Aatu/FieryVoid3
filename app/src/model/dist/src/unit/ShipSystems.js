import ShipPower from "./ShipPower";
import ShipSystemSections from "./system/ShipSystemSections";
import { hexFacingToAngle } from "../utils/math";
import { ShipSystemType, } from "./system/ShipSystem";
import { SYSTEM_HANDLERS } from "./system/strategy/types/SystemHandlersTypes";
class ShipSystems {
    ship;
    systems;
    systemsAsArray;
    power;
    sections;
    constructor(ship) {
        this.ship = ship;
        this.systems = {};
        this.systemsAsArray = [];
        this.sections = new ShipSystemSections(ship);
        this.power = new ShipPower(this);
    }
    markDestroyedThisTurn() {
        this.ship.markDestroyedThisTurn();
    }
    isDestroyed() {
        const structuresDestroyed = this.sections.sections.reduce((total, section) => {
            const structure = section.getStructure();
            if (structure && structure.isDestroyed()) {
                return total + 1;
            }
            return total;
        }, 0);
        const structures = this.sections.sections.reduce((total, section) => {
            if (section.getStructure()) {
                return total + 1;
            }
            return total;
        }, 0);
        const primaryStructure = this.sections.getPrimarySection()?.getStructure();
        return ((!primaryStructure || primaryStructure.isDestroyed()) &&
            structuresDestroyed > structures / 2);
    }
    getSectionsForHit(attackPosition, lastSection) {
        return this.sections.getHitSections(attackPosition, this.ship.getPosition(), hexFacingToAngle(this.ship.getFacing()), lastSection);
    }
    getSystemsForOuterHit(attackPosition, lastSection, excludeAlwaysTargetable = false) {
        const isValidSystemForHit = (system) => {
            if (system.isDestroyed()) {
                return false;
            }
            if (system.getSystemType() === ShipSystemType.EXTERNAL) {
                return true;
            }
            if (system.getSystemType() === ShipSystemType.STRUCTURE) {
                return true;
            }
            const structure = system.getStructure();
            if (system.getSystemType() === ShipSystemType.INTERNAL &&
                (!structure || structure.isDestroyed())) {
                return true;
            }
            return false;
        };
        const systems = this.getSectionsForHit(attackPosition, lastSection).reduce((all, section) => {
            return [...all, ...section.getSystems().filter(isValidSystemForHit)];
        }, []);
        const alwaysTargetable = !excludeAlwaysTargetable
            ? this.getSystems().filter((system) => system.handlers.isAlwaysTargetable() &&
                systems.every((s) => s.id !== system.id))
            : [];
        return [...systems, ...alwaysTargetable];
    }
    getSystemsForInnerHit(section) {
        const isValidSystemForHit = (system) => {
            if (system.isDestroyed()) {
                return false;
            }
            if (system.getSystemType() === ShipSystemType.INTERNAL) {
                return true;
            }
            return false;
        };
        const systems = section.getSystems().filter(isValidSystemForHit);
        return [
            ...systems,
            ...this.getSystems().filter((system) => system.handlers.isAlwaysTargetable()),
        ];
    }
    addSystem(system, section) {
        if (this.getSystemById(system.id)) {
            throw new Error("System with duplicate id! " + system.id);
        }
        if (!system.id) {
            throw new Error("System with falsy id!");
        }
        this.systems[system.id] = system;
        this.systemsAsArray.push(system);
        section.addSystem(system);
        system.addShipSystemsReference(this);
        return this;
    }
    addPrimarySystem(systems) {
        const section = this.sections.getPrimarySection();
        if (!section) {
            throw new Error("ship does not have primary section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addFrontSystem(systems) {
        const section = this.sections.getFrontSection();
        if (!section) {
            throw new Error("ship does not have front section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addAftSystem(systems) {
        const section = this.sections.getAftSection();
        if (!section) {
            throw new Error("ship does not have aft section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addStarboardFrontSystem(systems) {
        const section = this.sections.getStarboardFrontSection();
        if (!section) {
            throw new Error("ship does not have starboard front section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addStarboardAftSystem(systems) {
        const section = this.sections.getStarboardAftSection();
        if (!section) {
            throw new Error("ship does not have starboard aft section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addPortFrontSystem(systems) {
        const section = this.sections.getPortFrontSection();
        if (!section) {
            throw new Error("ship does not have port front section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    addPortAftSystem(systems) {
        const section = this.sections.getPortAftSection();
        if (!section) {
            throw new Error("ship does not have port aft section");
        }
        systems = [].concat(systems);
        systems.forEach((system) => this.addSystem(system, section));
        return this;
    }
    getSectionForSystem(system) {
        return this.sections.getSectionForSystem(system);
    }
    getStructureForSystem(system) {
        const section = this.getSectionForSystem(system);
        return section?.getStructure() || null;
    }
    getSystemById(id) {
        return this.systems[id];
    }
    getSystems() {
        return this.systemsAsArray;
    }
    deserialize(data = []) {
        data.forEach((systemData) => {
            const system = this.getSystemById(systemData.systemId);
            if (system) {
                system.deserialize(systemData.data);
            }
        });
        return this;
    }
    serialize() {
        return this.systemsAsArray.map((system) => ({
            systemId: system.id,
            data: system.serialize(),
        }));
    }
    endTurn(turn) {
        this.getSystems().forEach((system) => {
            system.endTurn(turn);
        });
    }
    advanceTurn(turn) {
        this.getSystems().forEach((system) => {
            system.advanceTurn(turn);
        });
        this.power.advanceTurn(turn);
        return this;
    }
    getRequiredPhasesForReceivingPlayerData() {
        return this.getSystems()
            .map((system) => system.callHandler(SYSTEM_HANDLERS.getRequiredPhasesForReceivingPlayerData, null, 0))
            .sort((a, b) => {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        })[0];
    }
    receivePlayerData(clientShip, gameData, phase) {
        this.getSystems().forEach((system) => {
            if (phase >
                system.callHandler(SYSTEM_HANDLERS.getRequiredPhasesForReceivingPlayerData, null, 1)) {
                return;
            }
            system.callHandler(SYSTEM_HANDLERS.receivePlayerData, {
                clientShip,
                clientSystem: clientShip.systems.getSystemById(system.id),
                gameData,
                phase,
            }, undefined);
        });
    }
    censorForUser(user, mine) {
        this.getSystems().forEach((system) => {
            system.callHandler(SYSTEM_HANDLERS.censorForUser, { user, mine }, undefined);
        });
    }
    callAllSystemHandlers(name, payload) {
        return this.getSystems()
            .reduce((total, system) => [
            ...total,
            ...[].concat(system.callHandler(name, payload, undefined)),
        ], [])
            .filter(Boolean);
    }
    getTotalHeat() {
        return this.getSystems().reduce((total, system) => total + system.heat.getHeat(), 0);
    }
    getTotalHeatStorage() {
        return this.getSystems().reduce((total, system) => total + system.heat.getMaxHeatStoreCapacity(), 0);
    }
    getTotalHeatStored() {
        return this.getSystems()
            .filter((system) => system.heat.isHeatStorage())
            .reduce((total, system) => total + system.heat.getHeat(), 0);
    }
    getPassiveHeatChange() {
        const producedAndTransferred = this.getSystems().reduce((total, system) => {
            const { cooling } = system.heat.predictHeatChange();
            return total + cooling;
        }, 0);
        const heatRadiated = this.getSystems().reduce((total, system) => total + system.heat.getRadiateHeatCapacity(), 0);
        return producedAndTransferred - heatRadiated;
    }
}
export default ShipSystems;
