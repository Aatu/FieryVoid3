import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class AftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_AFT);
  }
}

export default AftSection;
