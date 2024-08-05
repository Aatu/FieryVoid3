import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class FrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_FRONT);
  }
}

export default FrontSection;
