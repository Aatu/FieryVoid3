import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { LoadingTimeIncreased } from "../../criticals/index.mjs";

class StandardLoadingStrategy extends ShipSystemStrategy {
  constructor(loadingTime) {
    super();
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
  }

  getMessages(payload, previousResponse = []) {
    const boost = this.system.callHandler("getBoost", null, 0);
    const loading = 1 + boost;

    previousResponse.push({
      header: "Charging",
      value: `${this.turnsLoaded} / ${this.loadingTime} +${loading} per turn`
    });

    const boostPower = this.system.callHandler(
      "getPowerRequiredForBoost",
      null,
      0
    );

    if (boostPower) {
      previousResponse.push({
        header: "Charging boostable",
        value: `${boostPower} power required`
      });
    }

    return previousResponse;
  }

  canFire(payload, previousResponse = true) {
    if (!this.isLoaded()) {
      return false;
    }

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

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        severity: 40,
        critical: new LoadingTimeIncreased(1, this.loadingTime)
      },
      {
        severity: 80,
        critical: new LoadingTimeIncreased(1, this.loadingTime * 3)
      },
      { severity: 100, critical: new LoadingTimeIncreased(1) }
    ];
  }
}

export default StandardLoadingStrategy;
