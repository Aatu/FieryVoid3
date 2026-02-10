import WeaponHitChance, { SerializedWeaponHitChance } from "../weapon/WeaponHitChance";
import { ICombatLogEntry } from "./combatLogClasses";
export type SerializedCombatLogTorpedoIntercept = {
    logEntryClass: string;
    torpedoFlightId: string;
    intercepts: {
        shipId: string;
        interceptorId: number;
        hitChance: SerializedWeaponHitChance;
        roll: number;
        success: boolean;
    }[];
};
type Intercept = {
    shipId: string;
    interceptorId: number;
    hitChance: WeaponHitChance;
    roll: number;
    success: boolean;
};
declare class CombatLogTorpedoIntercept implements ICombatLogEntry {
    torpedoFlightId: string;
    replayOrder: number;
    intercepts: Intercept[];
    constructor(torpedoFlightId: string);
    addIntercept(intercept: Intercept): void;
    isSucessfull(): boolean;
    serialize(): SerializedCombatLogTorpedoIntercept;
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogTorpedoIntercept;
