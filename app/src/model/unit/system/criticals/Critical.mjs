class Critical {
  constructor() {
    this.duration = null;
    this.name = this.constructor.name;
  }

  getDuration() {
    return this.duration;
  }

  getClassName() {
    return this.name;
  }
}

export default Critical;
