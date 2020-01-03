import Critical from "./Critical.mjs";

class EfficiencyHalved extends Critical {
  getMessage() {
    if (this.duration !== 0) {
      return `Two thrust required to channel one through for ${this.turnsRemaining} turns`;
    }
    return `Two thrust required to channel one through`;
  }

  excludes(critical) {
    return critical instanceof EfficiencyHalved;
  }

  isReplacedBy(critical) {
    return false;
  }
}

export default EfficiencyHalved;
