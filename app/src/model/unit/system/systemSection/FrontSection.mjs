import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class FrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_FRONT);
  }
}

export default FrontSection;
