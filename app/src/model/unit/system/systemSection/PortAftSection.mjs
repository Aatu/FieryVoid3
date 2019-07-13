import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class PortAftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_AFT);
  }
}

export default PortAftSection;
