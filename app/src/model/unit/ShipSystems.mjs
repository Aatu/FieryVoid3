import ShipPower from "./ShipPower.mjs";
import ShipSystemSections from "./system/ShipSystemSections";

class ShipSystems {
  constructor(ship) {
    this.ship = ship;
    this.systems = {};
    this.systemsAsArray = [];

    this.sections = new ShipSystemSections();
    this.power = new ShipPower(this);
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

  addStarboardSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getStarboardSection())
    );

    return this;
  }

  addPortSystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system =>
      this.addSystem(system, this.sections.getPortSection())
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
}

export default ShipSystems;
