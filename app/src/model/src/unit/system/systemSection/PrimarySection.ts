import { SYSTEM_LOCATION } from "./systemLocation.js";
import SystemSection from "./SystemSection.js";

class PrimarySection extends SystemSection {
  constructor() {
    super(SYSTEM_LOCATION.PRIMARY);
  }
}

export default PrimarySection;
