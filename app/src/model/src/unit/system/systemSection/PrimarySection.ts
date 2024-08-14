import { SYSTEM_LOCATION } from "./systemLocation";
import SystemSection from "./SystemSection";

class PrimarySection extends SystemSection {
  constructor() {
    super(SYSTEM_LOCATION.PRIMARY);
  }
}

export default PrimarySection;
