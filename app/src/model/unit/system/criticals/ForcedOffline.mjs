import Critical from "./Critical.mjs";

class ForcedOffline extends Critical {
  getMessage() {
    return `Forced offline for ${this.turnsRemaining} turns`;
  }

  excludes(critical) {
    return (
      critical instanceof ForcedOffline &&
      critical.getDuration() <= this.turnsRemaining
    );
  }

  isReplacedBy(critical) {
    return (
      critical instanceof ForcedOffline &&
      critical.getDuration() > this.turnsRemaining
    );
  }
}

export default ForcedOffline;
