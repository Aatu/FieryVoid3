import Critical, { SerializedCritical } from "./Critical";

export type SerializedLoadingTimeIncreased = SerializedCritical & {
  loadingTimeIncrease: number;
};

class LoadingTimeIncreased extends Critical {
  private loadingTimeIncrease: number;

  constructor(duration: number | null, loadingTimeIncrease: number) {
    super(duration);

    this.loadingTimeIncrease = loadingTimeIncrease;
  }

  serialize(): SerializedLoadingTimeIncreased {
    return {
      ...super.serialize(),
      loadingTimeIncrease: this.loadingTimeIncrease,
    };
  }

  deserialize(data: SerializedLoadingTimeIncreased) {
    super.deserialize(data);
    this.loadingTimeIncrease = data.loadingTimeIncrease || 1;

    return this;
  }

  getMessage(): string {
    if (this.duration) {
      return `Charging time increased by ${this.loadingTimeIncrease} for ${this.turnsRemaining} turns`;
    }
    return `Charging time increased by ${this.loadingTimeIncrease}`;
  }

  getLoadingTimeIncrease(): number {
    return this.loadingTimeIncrease;
  }

  excludes(critical: Critical) {
    if (!(critical instanceof LoadingTimeIncreased)) {
      return false;
    }

    if (critical.loadingTimeIncrease < this.loadingTimeIncrease) {
      return true;
    }

    if (critical.loadingTimeIncrease > this.loadingTimeIncrease) {
      return false;
    }

    const duration = critical.getDuration();

    if (duration !== null && this.getDuration() === null) {
      return true;
    }

    return (
      duration !== null &&
      this.turnsRemaining !== null &&
      duration <= this.turnsRemaining
    );
  }

  isReplacedBy(critical: Critical) {
    if (!(critical instanceof LoadingTimeIncreased)) {
      return false;
    }

    if (critical.loadingTimeIncrease > this.loadingTimeIncrease) {
      return true;
    }

    if (critical.getDuration() === null && this.getDuration() !== null) {
      return true;
    }

    const duration = critical.getDuration();

    return (
      duration !== null &&
      this.turnsRemaining !== null &&
      duration <= this.turnsRemaining
    );
  }
}

export default LoadingTimeIncreased;
