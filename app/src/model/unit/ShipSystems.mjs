import ShipPower from "./ShipPower.mjs";
import ShipSystemSections from "./system/ShipSystemSections";
import { hexFacingToAngle } from "../utils/math.mjs";

class ShipSystems {
  constructor(ship) {
    this.ship = ship;
    this.systems = {};
    this.systemsAsArray = [];

    this.sections = new ShipSystemSections();
    this.power = new ShipPower(this);
  }

  getSystemsForHit(attackPosition, ignoreSections = []) {
    return this.sections
      .getHitSection(
        attackPosition,
        this.ship.getPosition(),
        hexFacingToAngle(this.ship.getFacing()),
        ignoreSections
      )
      .reduce((all, section) => {
        return [
          ...all,
          ...section.getSystems().filter(system => !system.isDestroyed())
        ];
      }, []);
  }

  getSystemsForOverkill(attackPosition, system) {
    //TODO: return structure in same section
    // if no structure, return getSystemsForHit with hit systems section in ignore list
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

  advanceTurn(turn) {
    this.getSystems().forEach(system => {
      system.callHandler("advanceTurn", turn);
    });

    return this;
  }
}

export default ShipSystems;
