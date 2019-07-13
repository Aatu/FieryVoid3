import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class PortFrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_FRONT);
  }
}

export default PortFrontSection;
