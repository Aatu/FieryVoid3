import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardLoadingStrategy extends ShipSystemStrategy {
  constructor(loadingTime) {
    super();
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Cooldown",
      value: `${this.turnsLoaded} / ${this.loadingTime}`
    });

    return previousResponse;
  }

  usesLoading() {
    return true;
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
    return this.turnsLoaded >= this.getLoadingTime();
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

    const boost = this.system.callHandler("getBoost", null, 0);
    const loadingStep = 1 + boost;
    this.turnsLoaded += loadingStep;

    if (this.turnsLoaded > this.loadingTime) {
      this.turnsLoaded = this.loadingTime;
    }
  }
}

export default StandardLoadingStrategy;
