import WeaponHitChance, { SerializedWeaponHitChance } from "../weapon/WeaponHitChance";
export type SerializedCombatLogWeaponFireHitResult = {
    result: boolean;
    hitChance: SerializedWeaponHitChance;
    hitRoll: number;
    shotsHit: number;
    shotsMissed: number;
};
declare class CombatLogWeaponFireHitResult {
    result: boolean;
    hitChance: WeaponHitChance;
    hitRoll: number;
    shotsHit: number;
    shotsMissed: number;
    static fromData(data?: Partial<SerializedCombatLogWeaponFireHitResult>): CombatLogWeaponFireHitResult;
    constructor(result: boolean, hitChance: WeaponHitChance, hitRoll: number, shotsHit?: number, shotsMissed?: number);
    serialize(): SerializedCombatLogWeaponFireHitResult;
    deserialize(data?: Partial<SerializedCombatLogWeaponFireHitResult>): this;
}
export default CombatLogWeaponFireHitResult;
