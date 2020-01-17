import Critical from "./Critical.mjs";

class ThrustChannelHeatIncreased extends Critical {
  constructor(heatMultiplier = 0.5, duration) {
    super(duration);

    this.heatMultiplier = heatMultiplier;
  }

  serialize() {
    return {
      ...super.serialize(),
      heatMultiplier: this.heatMultiplier
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.heatMultiplier = data.heatMultiplier || 0.5;

    return this;
  }

  getMessage() {
    if (this.duration !== 0) {
      return `Heat per thrust increased by ${this.heatMultiplier} for ${this.turnsRemaining} turns`;
    }
    return `Heat per thrust increased by ${this.heatMultiplier}`;
  }

  getHeatIncrease() {
    return this.heatMultiplier;
  }

  excludes(critical) {
    if (!(critical instanceof ThrustChannelHeatIncreased)) {
      return false;
    }

    if (critical.heatMultiplier !== this.heatMultiplier) {
      return false;
    }

    if (critical.getDuration() !== null && this.getDuration() !== null) {
      return critical.getDuration() <= this.turnsRemaining;
    }

    return false;
  }

  isReplacedBy(critical) {
    if (!(critical instanceof ThrustChannelHeatIncreased)) {
      return false;
    }

    if (critical.getDuration() !== null && this.getDuration() !== null) {
      if (critical.heatMultiplier !== this.heatMultiplier) {
        return false;
      }

      return critical.getDuration() > this.turnsRemaining;
    }

    return false;
  }
}

export default ThrustChannelHeatIncreased;
