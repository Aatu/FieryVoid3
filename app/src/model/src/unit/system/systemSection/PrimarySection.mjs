import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class PrimarySection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PRIMARY);
  }
}

export default PrimarySection;
