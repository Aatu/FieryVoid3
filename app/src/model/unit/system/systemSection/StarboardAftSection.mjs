import SystemSection from "./SystemSection.mjs";
import * as systemLocation from "./systemLocation.mjs";

class StarboardAftSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_STARBOARD_AFT);
  }
}

export default StarboardAftSection;
