import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class StarboardSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_STARBOARD);
  }
}

export default StarboardSection;
