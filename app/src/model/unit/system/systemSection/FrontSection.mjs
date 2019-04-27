import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class FrontSection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_FRONT);
  }
}

export default FrontSection;
