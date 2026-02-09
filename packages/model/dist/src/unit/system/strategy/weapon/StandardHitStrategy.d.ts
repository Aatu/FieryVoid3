import ShipSystemStrategy from "../ShipSystemStrategy";
import WeaponHitChance from "../../../../weapon/WeaponHitChance";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult";
import { SystemMessage } from "../types/SystemHandlersTypes";
import Ship from "../../../Ship";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
export type HitResolution = {
    shooter: Ship;
    target: Ship;
    weaponSettings: Record<string, unknown>;
    combatLogEntry: CombatLogWeaponFire;
};
declare class StandardHitStrategy extends ShipSystemStrategy {
    fireControl: number;
    numberOfShots: number;
    burstSize: number;
    burstGrouping: number;
    constructor(fireControl?: number, numberOfShots?: number, burstSize?: number, burstGrouping?: number);
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getBaseHitChance({ shooter, target }: {
        shooter: Ship;
        target: Ship;
    }): number;
    checkFireOrderHits({ shooter, target, weaponSettings, combatLogEntry, }: HitResolution): CombatLogWeaponFireHitResult;
    getNumberOfShots(payload: unknown, previousResponse?: number): number;
    getBurstSize(payload: unknown, previousResponse?: number): number;
    getBurstGrouping(payload: unknown, previousResponse?: number): number;
    getFireControl(): number;
    getHitChance({ shooter, target, weaponSettings, }: {
        shooter: Ship;
        target: Ship;
        weaponSettings: Record<string, unknown>;
    }): WeaponHitChance;
    private getNumberOfBurstShotsHit;
}
export default StandardHitStrategy;
