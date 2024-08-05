import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class PortAftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_AFT);
  }
}

export default PortAftSection;
