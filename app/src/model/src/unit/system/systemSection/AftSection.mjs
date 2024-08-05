import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class AftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_AFT);
  }
}

export default AftSection;
