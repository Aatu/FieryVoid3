import ShipPower from "./ShipPower.mjs";
import ShipSystemSections from "./system/ShipSystemSections.mjs";
import { hexFacingToAngle } from "../utils/math.mjs";

class ShipSystems {
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
    const structuresDestroyed = this.sections.sections.reduce(
      (total, section) => {
        const structure = section.getStructure();

        if (structure && structure.isDestroyed()) {
          return total + 1;
        }

        return total;
      },
      0
    );

    const structures = this.sections.sections.reduce((total, section) => {
      if (section.getStructure()) {
        return total + 1;
      }

      return total;
    }, 0);

    const primaryStructure = this.sections.getPrimarySection().getStructure();

    return (
      (!primaryStructure || primaryStructure.isDestroyed()) &&
      structuresDestroyed > structures / 2
    );
  }

  getSectionsForHit(attackPosition, lastSection) {
    return this.sections.getHitSections(
      attackPosition,
      this.ship.getPosition(),
      hexFacingToAngle(this.ship.getFacing()),
      lastSection
    );
  }

  getSystemsForHit(attackPosition, lastSection) {
    const systems = this.getSectionsForHit(attackPosition, lastSection).reduce(
      (all, section) => {
        return [
          ...all,
          ...section.getSystems().filter(system => !system.isDestroyed())
        ];
      },
      []
    );

    return [
      ...systems,
      ...this.getSystems().filter(system =>
        system.callHandler("canBeTargeted", null, false)
      )
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
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getPrimarySection())
    );

    return this;
  }

  addFrontSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getFrontSection())
    );

    return this;
  }

  addAftSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getAftSection())
    );

    return this;
  }

  addStarboardFrontSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getStarboardFrontSection())
    );

    return this;
  }

  addStarboardAftSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getStarboardAftSection())
    );

    return this;
  }

  addPortFrontSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getPortFrontSection())
    );

    return this;
  }

  addPortAftSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getPortAftSection())
    );

    return this;
  }

  getSystemById(id) {
    return this.systems[id];
  }

  getSystems() {
    return this.systemsAsArray;
  }

  deserialize(data = []) {
    data.forEach(systemData => {
      const system = this.getSystemById(systemData.systemId);
      if (system) {
        system.deserialize(systemData.data);
      }
    });

    return this;
  }

  serialize() {
    return this.systemsAsArray.map(system => ({
      systemId: system.id,
      data: system.serialize()
    }));
  }

  endTurn(turn) {
    this.getSystems().forEach(system => {
      system.endTurn(turn);
    });
  }

  advanceTurn(turn) {
    this.getSystems().forEach(system => {
      system.advanceTurn(turn);
    });

    this.power.advanceTurn(turn);
    return this;
  }

  receivePlayerData(clientShip) {
    this.getSystems().forEach(system =>
      system.callHandler("receivePlayerData", {
        clientShip,
        clientSystem: clientShip.systems.getSystemById(system.id)
      })
    );
  }

  censorForUser(user, mine) {
    this.getSystems().forEach(system => {
      system.callHandler("censorForUser", { user, mine });
    });
  }

  callAllSystemHandlers(name, payload) {
    return this.getSystems()
      .reduce(
        (total, system) => [
          ...total,
          ...[].concat(system.callHandler(name, payload))
        ],
        []
      )
      .filter(Boolean);
  }

  getTotalHeat() {
    return this.getSystems().reduce(
      (total, system) => total + system.heat.getHeat(),
      0
    );
  }

  getTotalHeatStorage() {
    return this.getSystems().reduce(
      (total, system) => total + system.heat.getMaxHeatStoreCapacity(),
      0
    );
  }

  getTotalHeatStored() {
    return this.getSystems()
      .filter(system => system.heat.isHeatStorage())
      .reduce((total, system) => total + system.heat.getHeat(), 0);
  }

  getPassiveHeatChange() {
    const producedAndTransferred = this.getSystems().reduce((total, system) => {
      const heatGenerated = system.heat.getHeatGenerated();
      const heatTransfer = system.heat.getMaxTransferHeat();

      if (heatGenerated > heatTransfer) {
        return total + heatTransfer;
      }

      return total + heatGenerated;
    }, 0);

    const heatRadiated = this.getSystems().reduce(
      (total, system) => total + system.heat.getRadiateHeatCapacity(),
      0
    );

    return producedAndTransferred - heatRadiated;
  }
}

export default ShipSystems;
