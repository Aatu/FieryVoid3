import Critical from "./Critical";
class LoadingTimeIncreased extends Critical {
    loadingTimeIncrease;
    constructor(duration, loadingTimeIncrease) {
        super(duration);
        this.loadingTimeIncrease = loadingTimeIncrease;
    }
    serialize() {
        return {
            ...super.serialize(),
            loadingTimeIncrease: this.loadingTimeIncrease,
        };
    }
    deserialize(data) {
        super.deserialize(data);
        this.loadingTimeIncrease = data.loadingTimeIncrease || 1;
        return this;
    }
    getMessage() {
        if (this.duration) {
            return `Charging time increased by ${this.loadingTimeIncrease} for ${this.turnsRemaining} turns`;
        }
        return `Charging time increased by ${this.loadingTimeIncrease}`;
    }
    getLoadingTimeIncrease() {
        return this.loadingTimeIncrease;
    }
    excludes(critical) {
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
        return (duration !== null &&
            this.turnsRemaining !== null &&
            duration <= this.turnsRemaining);
    }
    isReplacedBy(critical) {
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
        return (duration !== null &&
            this.turnsRemaining !== null &&
            duration <= this.turnsRemaining);
    }
}
export default LoadingTimeIncreased;
