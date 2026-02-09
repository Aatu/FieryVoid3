import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack";
import CombatLogDamageEntry from "./CombatLogDamageEntry";
import CombatLogTorpedoLaunch from "./CombatLogTorpedoLaunch";
import CombatLogTorpedoIntercept from "./CombatLogTorpedoIntercept";
import CombatLogWeaponOutOfArc from "./CombatLogWeaponOutOfArc";
import CombatLogWeaponFire from "./CombatLogWeaponFire";
import CombatLogShipMovement from "./CombatLogShipMovement";
import CombatLogShipVelocity from "./CombatLogShipVelocity";
import CombatLogGroupedWeaponFire from "./CombatLogGroupedWeaponFire";
import CombatLogGroupedTorpedoAttack from "./CombatLogGroupedTorpedoAttack";
import { CombatLogCargoTransfer } from "./CombatLogCargoTransfer";
export interface ICombatLogEntry {
    replayOrder: number;
    serialize: () => Record<string, unknown>;
    deserialize: (data: Record<string, unknown>) => CombatLogEntry;
}
export type CombatLogEntry = CombatLogTorpedoAttack | CombatLogDamageEntry | CombatLogTorpedoLaunch | CombatLogTorpedoIntercept | CombatLogWeaponOutOfArc | CombatLogWeaponFire | CombatLogShipMovement | CombatLogShipVelocity | CombatLogGroupedWeaponFire | CombatLogGroupedTorpedoAttack | CombatLogCargoTransfer;
export declare const combatLogClasses: {
    CombatLogTorpedoAttack: typeof CombatLogTorpedoAttack;
    CombatLogDamageEntry: typeof CombatLogDamageEntry;
    CombatLogTorpedoLaunch: typeof CombatLogTorpedoLaunch;
    CombatLogTorpedoIntercept: typeof CombatLogTorpedoIntercept;
    CombatLogWeaponOutOfArc: typeof CombatLogWeaponOutOfArc;
    CombatLogWeaponFire: typeof CombatLogWeaponFire;
    CombatLogShipMovement: typeof CombatLogShipMovement;
    CombatLogShipVelocity: typeof CombatLogShipVelocity;
    CombatLogGroupedWeaponFire: typeof CombatLogGroupedWeaponFire;
    CombatLogGroupedTorpedoAttack: typeof CombatLogGroupedTorpedoAttack;
};
