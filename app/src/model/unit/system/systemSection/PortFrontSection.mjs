import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class PortFrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PORT_FRONT);
  }
}

export default PortFrontSection;
