import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { LoadingTimeIncreased } from "../../criticals/index.mjs";

class StandardLoadingStrategy extends ShipSystemStrategy {
  constructor(loadingTime) {
    super();
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
  }

  getMessages(payload, previousResponse = []) {
    const boostLoading = this._getBoostLoading();
    let loading = 1 + boostLoading;

    if (!Number.isInteger(loading)) {
      loading = loading.toFixed(1);
    }

    let turnsLoaded = this.turnsLoaded;

    if (!Number.isInteger(turnsLoaded)) {
      turnsLoaded = turnsLoaded.toFixed(1);
    }

    previousResponse.push({
      header: "Charging",
      value: `${turnsLoaded} / ${this.loadingTime} +${loading} per turn`
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

  _getTurnsUntilLoaded() {
    const left = this.loadingTime - this.turnsLoaded;
    const loadingPerTurn = 1 + this._getBoostLoading();

    return Math.ceil(left / loadingPerTurn);
  }

  getIconText() {
    if (this.system.isDisabled()) {
      return "";
    }

    const left = this._getTurnsUntilLoaded();
    if (left === 0) {
      return "L";
    }

    return `-${left}T`;
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

    const loadingStep = 1 + this._getBoostLoading();
    this.turnsLoaded += loadingStep;

    if (this.turnsLoaded > this.loadingTime) {
      this.turnsLoaded = this.loadingTime;
    }
  }

  _getBoostLoading() {
    let boost = this.system.callHandler("getBoost", null, 0);

    if (!boost) {
      return 0;
    }

    boost = boost / (this.getLoadingTime() - 1);
    boost = Math.ceil(boost * 10) / 10;
    return boost;
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
