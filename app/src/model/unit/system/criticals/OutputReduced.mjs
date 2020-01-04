import Critical from "./Critical.mjs";

class OutputReduced extends Critical {
  constructor(outputReduction, duration) {
    super(duration);

    this.outputReduction = outputReduction;
  }

  serialize() {
    return {
      ...super.serialize(),
      outputReduction: this.outputReduction
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.outputReduction = data.outputReduction || 1;

    return this;
  }

  getMessage() {
    if (this.duration !== 0) {
      return `Charging time increased by ${this.outputReduction} for ${this.turnsRemaining} turns`;
    }
    return `Charging time increased by ${this.outputReduction}`;
  }

  getOutputReduction() {
    return this.outputReduction;
  }

  excludes(critical) {
    if (!(critical instanceof OutputReduced)) {
      return false;
    }

    if (critical.outputReduction !== this.outputReduction) {
      return false;
    }

    if (critical.getDuration() !== null && this.getDuration() !== null) {
      return critical.getDuration() <= this.turnsRemaining;
    }

    return false;
  }

  isReplacedBy(critical) {
    if (!(critical instanceof OutputReduced)) {
      return false;
    }

    if (critical.getDuration() !== null && this.getDuration() !== null) {
      if (critical.outputReduction !== this.outputReduction) {
        return false;
      }

      return critical.getDuration() > this.turnsRemaining;
    }

    return false;
  }
}

export default OutputReduced;
