class Critical {
  constructor(duration = null) {
    this.duration = Number.isInteger(duration) ? duration + 1 : null;
    this.turnsRemaining = this.duration;
  }

  getMessage() {
    return "";
  }

  serialize() {
    return {
      className: this.getClassName(),
      turnsRemaining: this.turnsRemaining
    };
  }

  deserialize(data) {
    this.turnsRemaining = data.turnsRemaining || null;
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
