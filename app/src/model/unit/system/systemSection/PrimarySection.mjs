import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class PrimarySection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PRIMARY);
  }
}

export default PrimarySection;
