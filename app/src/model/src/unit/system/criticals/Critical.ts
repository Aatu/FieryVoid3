import { v4 as uuidv4 } from "uuid";
import ShipSystem from "../ShipSystem";

export type SerializedCritical = {
  className: string;
  id: string;
  duration: number | null;
  turnsRemaining: number | null;
};

class Critical {
  public id: string;
  public duration: number | null;
  public turnsRemaining: number | null;

  constructor(duration: number | null = null) {
    this.id = uuidv4();
    this.duration =
      duration && Number.isInteger(duration) ? duration + 1 : null;
    this.turnsRemaining = this.duration;
  }

  getMessage() {
    return "";
  }

  serialize(): SerializedCritical {
    return {
      className: this.getClassName(),
      id: this.id,
      duration: this.duration,
      turnsRemaining: this.turnsRemaining,
    };
  }

  deserialize(data: SerializedCritical) {
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

  excludes(critical: Critical) {
    return false;
  }

  isReplacedBy(critical: Critical) {
    return false;
  }

  isFixed(system: ShipSystem) {
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
