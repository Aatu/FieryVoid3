export type SerializedWeaponHitChance = {
  baseToHit?: number;
  fireControl?: number;
  dew?: number;
  oew?: number;
  distance?: number;
  evasion?: number;
  rangeModifier?: number;
  result?: number;
  absoluteResult?: number;
  outOfRange?: boolean;
  rollingPenalty?: number;
  noLockPenalty?: number;
  ownEvasionPenalty?: number;
  evasionPenalty?: number;
};

class WeaponHitChance {
  public baseToHit!: number;
  public fireControl!: number;
  public dew!: number;
  public oew!: number;
  public distance!: number;
  public evasion!: number;
  public rangeModifier!: number;
  public result!: number;
  public absoluteResult!: number;
  public outOfRange!: boolean;
  public rollingPenalty!: number;
  public noLockPenalty!: number;
  public ownEvasionPenalty!: number;
  public evasionPenalty!: number;

  constructor(data: SerializedWeaponHitChance = {}) {
    this.deserialize(data);
  }

  serialize(): SerializedWeaponHitChance {
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
      rollingPenalty: this.rollingPenalty,
      noLockPenalty: this.noLockPenalty,
      ownEvasionPenalty: this.ownEvasionPenalty,
      evasionPenalty: this.evasionPenalty,
    };
  }

  deserialize(data: SerializedWeaponHitChance = {}) {
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
    this.noLockPenalty = data.noLockPenalty || 0;
    this.ownEvasionPenalty = data.ownEvasionPenalty || 0;
    this.evasionPenalty = data.evasionPenalty || 0;

    return this;
  }
}

export default WeaponHitChance;
