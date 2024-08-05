import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class StarboardFrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_STARBOARD_FRONT);
  }
}

export default StarboardFrontSection;
