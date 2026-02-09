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
declare class WeaponHitChance {
    baseToHit: number;
    fireControl: number;
    dew: number;
    oew: number;
    distance: number;
    evasion: number;
    rangeModifier: number;
    result: number;
    absoluteResult: number;
    outOfRange: boolean;
    rollingPenalty: number;
    noLockPenalty: number;
    ownEvasionPenalty: number;
    evasionPenalty: number;
    constructor(data?: SerializedWeaponHitChance);
    serialize(): SerializedWeaponHitChance;
    deserialize(data?: SerializedWeaponHitChance): this;
}
export default WeaponHitChance;
