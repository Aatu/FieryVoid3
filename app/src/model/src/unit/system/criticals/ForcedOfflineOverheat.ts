import ShipSystem from "../ShipSystem.js";
import Critical from "./Critical.js";

class ForcedOfflineOverheat extends Critical {
  getMessage() {
    return `Forced offline until system heat lowers to 0.5 or below`;
  }

  excludes(critical: Critical) {
    return critical instanceof ForcedOfflineOverheat;
  }

  isFixed(system: ShipSystem) {
    return system.heat.getOverheatPercentage() < 0.5;
  }
}

export default ForcedOfflineOverheat;