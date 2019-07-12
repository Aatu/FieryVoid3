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
        loading: this.loading
      }
    };
  }

  deserialize(data = {}) {
    this.loading = data.standardLoadingStrategy
      ? data.standardLoadingStrategy.loading
      : 0;

    return this;
  }

  advanceTurn() {
    if (this.system.isDisabled()) {
      this.loading = 0;
    }

    this.loading++;
  }
}

export default StandardLoadingStrategy;
