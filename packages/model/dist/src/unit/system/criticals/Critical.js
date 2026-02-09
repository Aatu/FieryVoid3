import { v4 as uuidv4 } from "uuid";
class Critical {
    id;
    duration;
    turnsRemaining;
    constructor(duration = null) {
        this.id = uuidv4();
        this.duration =
            duration && Number.isInteger(duration) ? duration + 1 : null;
        this.turnsRemaining = this.duration;
    }
    getMessage() {
        return "";
    }
    serialize() {
        return {
            className: this.getClassName(),
            id: this.id,
            duration: this.duration,
            turnsRemaining: this.turnsRemaining,
        };
    }
    deserialize(data) {
        this.id = data.id;
        this.turnsRemaining = data.turnsRemaining;
        this.duration = data.duration;
        return this;
    }
    advanceTurn() {
        if (this.turnsRemaining !== null && this.turnsRemaining > 0) {
            this.turnsRemaining--;
        }
    }
    excludes(critical) {
        return false;
    }
    isReplacedBy(critical) {
        return false;
    }
    isFixed(system) {
        return this.turnsRemaining === 0;
    }
    getDuration() {
        return this.duration;
    }
    getClassName() {
        return this.constructor.name;
    }
}
export default Critical;
