import Structure from "../structure/Structure";

class SystemSection {
  constructor(location) {
    this.location = location;
    this.systems = [];
  }

  addSystem(system) {
    this.systems.push(system);
    return this;
  }

  getSystems() {
    return this.systems;
  }

  isLocation(location) {
    return this.location === location;
  }

  hasSystems() {
    return this.systems.length > 0;
  }

  getStructure() {
    return this.systems.find(system => system instanceof Structure);
  }

  getNonStructureSystems() {
    return this.systems.filter(system => !(system instanceof Structure));
  }
}

export default SystemSection;
