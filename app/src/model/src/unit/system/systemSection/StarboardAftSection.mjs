import SystemSection from "./SystemSection.js";
import * as systemLocation from "./systemLocation.js";

class StarboardAftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_STARBOARD_AFT);
  }
}

export default StarboardAftSection;
