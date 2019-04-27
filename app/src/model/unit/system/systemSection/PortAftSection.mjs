import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class PortAftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_AFT);
  }
}

export default PortAftSection;
