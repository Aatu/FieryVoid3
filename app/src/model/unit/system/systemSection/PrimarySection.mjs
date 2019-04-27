import SystemSection from "./SystemSection";
import * as systemLocation from "./systemLocation";

class PrimarySection extends SystemSection {
  constructor() {
    super(systemLocation.SYSTEM_LOCATION_PRIMARY);
  }
}

export default PrimarySection;
