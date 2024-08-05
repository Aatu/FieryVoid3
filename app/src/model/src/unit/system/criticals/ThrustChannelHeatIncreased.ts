import { SystemMessage } from "../strategy/types/SystemHandlersTypes";
import Critical, { SerializedCritical } from "./Critical";

export type SerializedThrustChannelHeatIncreased = SerializedCritical & {
  heatMultiplier?: number;
};

class ThrustChannelHeatIncreased extends Critical {
  private heatMultiplier: number;

  constructor(heatMultiplier = 0.5, duration: number | null = null) {
    super(duration);

    this.heatMultiplier = heatMultiplier;
  }

  serialize(): SerializedThrustChannelHeatIncreased {
    return {
      ...super.serialize(),
      heatMultiplier: this.heatMultiplier,
    };
  }

  deserialize(data: SerializedThrustChannelHeatIncreased) {
    super.deserialize(data);
    this.heatMultiplier = data.heatMultiplier || 0.5;

    return this;
  }

  getMessage(): string {
    if (this.duration) {
      return `Heat per thrust increased by ${this.heatMultiplier} for ${this.turnsRemaining} turns`;
    }
    return `Heat per thrust increased by ${this.heatMultiplier}`;
  }

  getHeatIncrease() {
    return this.heatMultiplier;
  }

  excludes(critical: Critical) {
    if (!(critical instanceof ThrustChannelHeatIncreased)) {
      return false;
    }

    if (critical.heatMultiplier !== this.heatMultiplier) {
      return false;
    }

    const duration = critical.getDuration();

    if (
      duration !== null &&
      this.getDuration() !== null &&
      this.turnsRemaining !== null
    ) {
      return duration <= this.turnsRemaining;
    }

    return false;
  }

  isReplacedBy(critical: Critical) {
    if (!(critical instanceof ThrustChannelHeatIncreased)) {
      return false;
    }

    const duration = critical.getDuration();

    if (
      duration !== null &&
      this.getDuration() !== null &&
      this.turnsRemaining !== null
    ) {
      if (critical.heatMultiplier !== this.heatMultiplier) {
        return false;
      }

      return duration > this.turnsRemaining;
    }

    return false;
  }
}

export default ThrustChannelHeatIncreased;
