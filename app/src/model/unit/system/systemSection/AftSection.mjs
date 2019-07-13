import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class AftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_AFT);
  }
}

export default AftSection;
