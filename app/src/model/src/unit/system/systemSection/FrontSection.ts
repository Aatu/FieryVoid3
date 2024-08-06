import { SYSTEM_LOCATION } from "./systemLocation.js";
import SystemSection from "./SystemSection.js";

class FrontSection extends SystemSection {
  constructor() {
    super(SYSTEM_LOCATION.FRONT);
  }
}

export default FrontSection;
