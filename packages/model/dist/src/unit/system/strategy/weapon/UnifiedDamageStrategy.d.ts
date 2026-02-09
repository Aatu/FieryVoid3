import { Vector } from "three/examples/jsm/Addons.js";
import { DiceRoller, DiceRollFormula } from "../../../../utils/DiceRoller";
import Ship from "../../../Ship";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import SystemSection from "../../systemSection/SystemSection";
import ShipSystem from "../../ShipSystem";
import HitSystemRandomizer from "./utils/HitSystemRandomizer";
import { IVector } from "../../../../utils/Vector";
import ShipSystemStrategy from "../ShipSystemStrategy";
export interface IDamageOverrider {
    getDamageOverrider(args: UnifiedDamageStrategyArgs): UnifiedDamageStrategyArgs;
}
export type CombatLogEntry = {
    addNote: (note: string) => void;
    addDamage: (damageEntry: CombatLogDamageEntry) => void;
};
export type UnifiedDamagePayload = {
    target: Ship;
    attackPosition: Vector;
    argsOverrider?: IDamageOverrider;
    combatLogEntry: CombatLogEntry;
    diceRoller?: DiceRoller;
    hitSystemRandomizer?: HitSystemRandomizer;
    combatLogDamageEntry?: CombatLogDamageEntry;
};
export type UnifiedDamageStrategyArgs = {
    iterations: DiceRollFormula;
    armorPiercingFormula: DiceRollFormula;
    damageFormula: DiceRollFormula;
    overPenetrationDamageMultiplier: DiceRollFormula;
    damageArmorModifier: DiceRollFormula;
};
export declare class UnifiedDamageStrategy {
    private iterations;
    private armorPiercingFormula;
    private damageFormula;
    private overPenetrationDamageMultiplier;
    private damageArmorModifier;
    constructor(args?: Partial<UnifiedDamageStrategyArgs>);
    applyDamageFromWeaponFire(payload: UnifiedDamagePayload): void;
    protected doDamage(payload: Required<UnifiedDamagePayload>, damageArgs: UnifiedDamageStrategyArgs, combatLogDamageEntry: CombatLogDamageEntry, systemsHit: ShipSystem[], lastSection: SystemSection | null, armorPiercing: number): void;
    protected getDamageArgs(argsOverrider?: IDamageOverrider | null): UnifiedDamageStrategyArgs;
    protected getValidSystemsForOuterHit(shooterPosition: IVector, target: Ship, lastSection: SystemSection | null, excludeAlwaysTargetable?: boolean): ShipSystem[];
    protected getValidSystemsForInnerHit(target: Ship, section: SystemSection): ShipSystem[];
    protected doDamageToSystem(diceRoller: DiceRoller, damageArgs: UnifiedDamageStrategyArgs, combatLogEntry: CombatLogDamageEntry, hitSystem: ShipSystem, isPenetrating: boolean, armorPiercing: number): number;
}
export declare class UnifiedDamageSystemStrategy extends ShipSystemStrategy {
    private strategy;
    constructor(args?: Partial<UnifiedDamageStrategyArgs>);
    applyDamageFromWeaponFire(payload: UnifiedDamagePayload): void;
}
