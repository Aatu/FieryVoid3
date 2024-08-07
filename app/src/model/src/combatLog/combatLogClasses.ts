import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack";
import CombatLogDamageEntry from "./CombatLogDamageEntry";
import CombatLogTorpedoLaunch from "./CombatLogTorpedoLaunch";
import CombatLogTorpedoIntercept from "./CombatLogTorpedoIntercept";
import CombatLogTorpedoMove from "./CombatLogTorpedoMove";
import CombatLogTorpedoOutOfTime from "./CombatLogTorpedoOutOfTime";
import CombatLogWeaponOutOfArc from "./CombatLogWeaponOutOfArc";
import CombatLogWeaponFire from "./CombatLogWeaponFire";
import CombatLogShipMovement from "./CombatLogShipMovement";
import CombatLogShipVelocity from "./CombatLogShipVelocity";
import CombatLogTorpedoNotArmed from "./CombatLogTorpedoNotArmed";
import CombatLogGroupedWeaponFire from "./CombatLogGroupedWeaponFire";
import CombatLogGroupedTorpedoAttack from "./CombatLogGroupedTorpedoAttack";

export interface ICombatLogEntry {
  replayOrder: number;
}

export type CombatLogEntry =
  | CombatLogTorpedoAttack
  | CombatLogDamageEntry
  | CombatLogTorpedoLaunch
  | CombatLogTorpedoIntercept
  | CombatLogTorpedoMove
  | CombatLogTorpedoOutOfTime
  | CombatLogWeaponOutOfArc
  | CombatLogWeaponFire
  | CombatLogShipMovement
  | CombatLogShipVelocity
  | CombatLogTorpedoNotArmed
  | CombatLogGroupedWeaponFire
  | CombatLogGroupedTorpedoAttack;

export const combatLogClasses = {
  CombatLogTorpedoAttack,
  CombatLogDamageEntry,
  CombatLogTorpedoLaunch,
  CombatLogTorpedoIntercept,
  CombatLogTorpedoMove,
  CombatLogTorpedoOutOfTime,
  CombatLogWeaponOutOfArc,
  CombatLogWeaponFire,
  CombatLogShipMovement,
  CombatLogShipVelocity,
  CombatLogTorpedoNotArmed,
  CombatLogGroupedWeaponFire,
  CombatLogGroupedTorpedoAttack,
};
