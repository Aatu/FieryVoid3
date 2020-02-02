class WeaponHitChange {
  constructor(data) {
    this.deserialize(data);
  }

  serialize() {
    return {
      baseToHit: this.baseToHit,
      fireControl: this.fireControl,
      dew: this.dew,
      oew: this.oew,
      distance: this.distance,
      evasion: this.evasion,
      rangeModifier: this.rangeModifier,
      result: this.result,
      absoluteResult: this.absoluteResult,
      outOfRange: this.outOfRange,
      rollingPenalty: this.rollingPenalty
    };
  }

  deserialize(data = {}) {
    this.baseToHit = data.baseToHit || 0;
    this.fireControl = data.fireControl || 0;
    this.dew = data.dew || 0;
    this.oew = data.oew || 0;
    this.distance = data.distance || 0;
    this.rangeModifier = data.rangeModifier || 0;
    this.result = data.result || 0;
    this.absoluteResult = data.absoluteResult || 0;
    this.outOfRange = data.outOfRange || false;
    this.evasion = data.evasion || 0;
    this.rollingPenalty = data.rollingPenalty || 0;

    return this;
  }
}

export default WeaponHitChange;
