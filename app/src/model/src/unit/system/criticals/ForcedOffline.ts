import Critical from "./Critical.js";

class ForcedOffline extends Critical {
  getMessage() {
    return `Forced offline for ${this.turnsRemaining} turns`;
  }

  excludes(critical: Critical) {
    const duration = critical.getDuration();

    return (
      critical instanceof ForcedOffline &&
      this.turnsRemaining !== null &&
      duration !== null &&
      duration <= this.turnsRemaining
    );
  }

  isReplacedBy(critical: Critical) {
    const duration = critical.getDuration();

    return (
      critical instanceof ForcedOffline &&
      this.turnsRemaining !== null &&
      duration !== null &&
      duration > this.turnsRemaining
    );
  }
}

export default ForcedOffline;
