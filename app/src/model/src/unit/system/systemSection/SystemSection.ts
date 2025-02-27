import Structure from "../structure/Structure";
import { SYSTEM_LOCATION } from "./systemLocation";
import ShipSystem from "../ShipSystem";
import Offset from "../../../hexagon/Offset";

class SystemSection {
  private location: SYSTEM_LOCATION;
  private systems: ShipSystem[];

  constructor(location: SYSTEM_LOCATION) {
    this.location = location;
    this.systems = [];
  }

  getLocation() {
    return this.location;
  }

  getOffsetHex() {
    switch (this.location) {
      case SYSTEM_LOCATION.PRIMARY:
        return new Offset(0, 0);
      case SYSTEM_LOCATION.FRONT:
        return new Offset(1, 0);
      case SYSTEM_LOCATION.AFT:
        return new Offset(-1, 0);
      case SYSTEM_LOCATION.PORT_FRONT:
        return new Offset(1, 1);
      case SYSTEM_LOCATION.PORT_AFT:
        return new Offset(0, 1);
      case SYSTEM_LOCATION.STARBOARD_FRONT:
        return new Offset(1, -1);
      case SYSTEM_LOCATION.STARBOARD_AFT:
        return new Offset(0, -1);
    }
  }

  hasUndestroyedStructure() {
    return this.systems.some(
      (system) => system instanceof Structure && !system.isDisabled()
    );
  }

  addSystem(system: ShipSystem) {
    this.systems.push(system);
    return this;
  }

  getSystems() {
    return this.systems;
  }

  isLocation(location: SYSTEM_LOCATION) {
    return this.location === location;
  }

  hasSystems() {
    return this.systems.length > 0;
  }

  getStructure() {
    return this.systems.find((system) => system instanceof Structure);
  }

  getNonStructureSystems() {
    return this.systems.filter((system) => !(system instanceof Structure));
  }
}

export default SystemSection;
