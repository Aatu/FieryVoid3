import Critical, { SerializedCritical } from "./Critical";

export type SerializedOutputReduced = SerializedCritical & {
  outputReduction?: number;
};

class OutputReduced extends Critical {
  private outputReduction: number;

  constructor(outputReduction: number, duration: number | null = null) {
    super(duration);

    this.outputReduction = outputReduction;
  }

  serialize() {
    return {
      ...super.serialize(),
      outputReduction: this.outputReduction,
    };
  }

  deserialize(data: SerializedOutputReduced) {
    super.deserialize(data);
    this.outputReduction = data.outputReduction || 1;

    return this;
  }

  getMessage() {
    if (this.duration) {
      return `Output decreased by ${this.outputReduction} for ${this.turnsRemaining} turns`;
    }
    return `Output decreased by ${this.outputReduction}`;
  }

  getOutputReduction() {
    return this.outputReduction;
  }

  excludes(critical: Critical) {
    if (!(critical instanceof OutputReduced)) {
      return false;
    }

    if (critical.outputReduction !== this.outputReduction) {
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
    if (!(critical instanceof OutputReduced)) {
      return false;
    }

    const duration = critical.getDuration();

    if (
      duration !== null &&
      this.getDuration() !== null &&
      this.turnsRemaining !== null
    ) {
      if (critical.outputReduction !== this.outputReduction) {
        return false;
      }

      return duration > this.turnsRemaining;
    }

    return false;
  }
}

export default OutputReduced;
