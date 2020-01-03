import Critical from "./Critical.mjs";

class FirstThrustIgnored extends Critical {
  getMessage() {
    if (this.duration !== 0) {
      return `First thrust channeled is ignored for ${this.turnsRemaining} turns`;
    }
    return `First thrust channeled is ignored`;
  }

  excludes(critical) {
    return critical instanceof FirstThrustIgnored;
  }

  isReplacedBy(critical) {
    return false;
  }
}

export default FirstThrustIgnored;
