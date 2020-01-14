import Critical from "./Critical.mjs";

class ForcedOfflineOverheat extends Critical {
  getMessage() {
    return `Forced offline until system heat lowers to 0.5 or below`;
  }

  excludes(critical) {
    return critical instanceof ForcedOfflineOverheat;
  }

  isFixed(system) {
    return system.heat.getOverheatPercentage() < 0.5;
  }
}

export default ForcedOfflineOverheat;
