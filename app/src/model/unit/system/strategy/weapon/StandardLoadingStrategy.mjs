import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { LoadingTimeIncreased } from "../../criticals/index.mjs";

class StandardLoadingStrategy extends ShipSystemStrategy {
  constructor(loadingTime) {
    super();
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
    this.firedThisTurn = false;
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

    const loadingTime = this.getLoadingTime();

    if (turnsLoaded > loadingTime) {
      turnsLoaded = loadingTime;
    }

    previousResponse.push({
      header: "Charging",
      value: `${turnsLoaded} / ${loadingTime} +${loading} per turn`
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
    const left = this.getLoadingTime() - this.turnsLoaded;
    const loadingPerTurn = 1 + this._getBoostLoading();

    return Math.ceil(left / loadingPerTurn);
  }

  getIconText(payload, previousResponse = "") {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    const left = this._getTurnsUntilLoaded();
    if (left <= 0) {
      return previousResponse;
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
    this.firedThisTurn = true;
  }

  getLoadingTime() {
    const extra = this.system.damage
      .getCriticals()
      .filter(critical => critical instanceof LoadingTimeIncreased)
      .reduce((total, current) => total + current.getLoadingTimeIncrease(), 0);

    return this.loadingTime + extra;
  }

  getTurnsLoaded() {
    return this.turnsLoaded;
  }

  isReady(payload, previousResponse = null) {
    if (previousResponse === false) {
      return false;
    }

    return this.isLoaded();
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

    if (this.firedThisTurn) {
      this.turnsLoaded = 0;
    }

    const loadingStep = 1 + this._getBoostLoading();
    this.turnsLoaded += loadingStep;
  }

  _getBoostLoading() {
    let boost = this.system.callHandler("getBoost", null, 0);

    if (!boost) {
      return 0;
    }

    const targetLoading = this.getLoadingTime() - boost;
    return this.getLoadingTime() / targetLoading - 1;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        severity: 40,
        critical: new LoadingTimeIncreased(this.loadingTime, 1)
      },
      {
        severity: 80,
        critical: new LoadingTimeIncreased(this.loadingTime * 3, 1)
      },
      { severity: 100, critical: new LoadingTimeIncreased(null, 1) }
    ];
  }
}

export default StandardLoadingStrategy;
