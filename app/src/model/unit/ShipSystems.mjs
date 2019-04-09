import ShipPower from "./ShipPower.mjs";

class ShipSystems {
  constructor(ship) {
    this.ship = ship;
    this.systems = {};
    this.systemsAsArray = [];

    this.power = new ShipPower(this);
  }

  addSystem(system, location) {
    if (this.getSystemById(system.id)) {
      throw new Error("System with duplicate id! " + system.id);
    }

    if (!system.id) {
      throw new Error("System with falsy id!");
    }

    this.systems[system.id] = system;
    this.systemsAsArray.push(system);

    return this;
  }

  addPrimarySystem(systems) {
    systems = [].concat(systems);
    systems.forEach(system => this.addSystem(system));

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
      shipId: this.ship.id,
      systemId: system.id,
      data: system.serialize()
    }));
  }
}

export default ShipSystems;
