import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class StarboardFrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_STARBOARD_FRONT);
  }
}

export default StarboardFrontSection;
