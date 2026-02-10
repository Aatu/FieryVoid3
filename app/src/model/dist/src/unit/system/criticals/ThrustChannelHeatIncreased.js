import Critical from "./Critical";
class ThrustChannelHeatIncreased extends Critical {
    heatMultiplier;
    constructor(heatMultiplier = 0.5, duration = null) {
        super(duration);
        this.heatMultiplier = heatMultiplier;
    }
    serialize() {
        return {
            ...super.serialize(),
            heatMultiplier: this.heatMultiplier,
        };
    }
    deserialize(data) {
        super.deserialize(data);
        this.heatMultiplier = data.heatMultiplier || 0.5;
        return this;
    }
    getMessage() {
        if (this.duration) {
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
        const duration = critical.getDuration();
        if (duration !== null &&
            this.getDuration() !== null &&
            this.turnsRemaining !== null) {
            return duration <= this.turnsRemaining;
        }
        return false;
    }
    isReplacedBy(critical) {
        if (!(critical instanceof ThrustChannelHeatIncreased)) {
            return false;
        }
        const duration = critical.getDuration();
        if (duration !== null &&
            this.getDuration() !== null &&
            this.turnsRemaining !== null) {
            if (critical.heatMultiplier !== this.heatMultiplier) {
                return false;
            }
            return duration > this.turnsRemaining;
        }
        return false;
    }
}
export default ThrustChannelHeatIncreased;
