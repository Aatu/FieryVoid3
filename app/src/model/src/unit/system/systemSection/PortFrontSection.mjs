import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class PortFrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_FRONT);
  }
}

export default PortFrontSection;
