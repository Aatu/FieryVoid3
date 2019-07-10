import Structure from "../structure/Structure";
import hexagon from "../../../hexagon";
import * as systemLocation from "./systemLocation";

class SystemSection {
  constructor(location) {
    this.location = location;
    this.systems = [];
  }

  getOffsetHex() {
    switch (this.location) {
      case systemLocation.SYSTEM_LOCATION_PRIMARY:
        return new hexagon.Offset(0, 0);
      case systemLocation.SYSTEM_LOCATION_FRONT:
        return new hexagon.Offset(1, 0);
      case systemLocation.SYSTEM_LOCATION_AFT:
        return new hexagon.Offset(-1, 0);
      case systemLocation.SYSTEM_LOCATION_PORT_FRONT:
        return new hexagon.Offset(1, 1);
      case systemLocation.SYSTEM_LOCATION_PORT_AFT:
        return new hexagon.Offset(0, 1);
      case systemLocation.SYSTEM_LOCATION_STARBOARD_FRONT:
        return new hexagon.Offset(1, -1);
      case systemLocation.SYSTEM_LOCATION_STARBOARD_AFT:
        return new hexagon.Offset(0, -1);
    }
  }

  hasUndestroyedStructure() {
    return this.systems.some(
      system => system instanceof Structure && !system.isDisabled()
    );
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
