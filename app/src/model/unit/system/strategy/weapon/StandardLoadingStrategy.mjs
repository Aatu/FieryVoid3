import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardLoadingStrategy extends ShipSystemStrategy {
  constructor(loadingTime) {
    super();

    this.loadingTime = loadingTime;
    this.turnsLoaded = 0;
  }

  onWeaponFired() {
    this.turnsLoaded = 0;
  }

  getLoadingTime() {
    return this.loadingTime;
  }

  getTurnsLoaded() {
    return this.turnsLoaded;
  }

  isLoaded() {
    return this.turnsLoaded >= this.loadingTime;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      standardLoadingStrategy: {
        turnsLoaded: this.turnsLoaded
      }
    };
  }

  deserialize(data = {}) {
    this.turnsLoaded = data.standardLoadingStrategy
      ? data.standardLoadingStrategy.turnsLoaded
      : 0;

    return this;
  }

  advanceTurn() {
    if (this.system.isDisabled()) {
      this.turnsLoaded = 0;
      return;
    }

    this.turnsLoaded++;

    if (this.turnsLoaded > this.loadingTime) {
      this.turnsLoaded = this.loadingTime;
    }
  }
}

export default StandardLoadingStrategy;
