import uuidv4 from "uuid/v4.js";

class Critical {
  constructor(duration = null) {
    this.id = uuidv4();
    this.duration = Number.isInteger(duration) ? duration + 1 : null;
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
      turnsRemaining: this.turnsRemaining
    };
  }

  deserialize(data) {
    this.id = data.id || null;
    this.turnsRemaining = data.turnsRemaining || null;
    this.duration = data.duration || null;
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

  isFixed() {
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
