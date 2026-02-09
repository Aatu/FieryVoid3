import ShipSystemStrategy from "../ShipSystemStrategy";
import HitSystemRandomizer from "./utils/HitSystemRandomizer";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import { SystemMessage } from "../types/SystemHandlersTypes";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult";
import Ship from "../../../Ship";
import Vector from "../../../../utils/Vector";
import SystemSection from "../../systemSection/SystemSection";
import FireOrder from "../../../../weapon/FireOrder";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
import ShipSystem from "../../ShipSystem";
import TorpedoFlight from "../../../TorpedoFlight";
import CombatLogTorpedoAttack from "../../../../combatLog/CombatLogTorpedoAttack";
export type DamagePayload = {
    target: Ship;
    shooter: Ship;
    fireOrder?: FireOrder;
    hitResolution?: CombatLogWeaponFireHitResult;
    combatLogEntry: CombatLogWeaponFire | CombatLogTorpedoAttack;
    torpedoFlight?: TorpedoFlight;
};
export type StandardDamagePayload = DamagePayload & {
    combatLogEntry: CombatLogWeaponFire;
    hitResolution: CombatLogWeaponFireHitResult;
};
export declare const isStandardDamagePayload: (payload: DamagePayload) => payload is StandardDamagePayload;
export type ChooseHitSystemFunction<T> = (payload: {
    target: Ship;
    shooterPosition: Vector;
    lastSection: SystemSection | null;
} & T) => ShipSystem | null;
declare class StandardDamageStrategy extends ShipSystemStrategy {
    damageFormula: string | number | null;
    armorPiercingFormula: string | number | null;
    hitSystemRandomizer: HitSystemRandomizer;
    constructor(damageFormula?: string | number | null, armorPiercingFormula?: string | number | null);
    protected getTotalBurstSize(): number;
    protected getDamageMessage(): string;
    protected getArmorPiercingMessage(): string;
    protected getDamageTypeMessage(): string;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    applyDamageFromWeaponFire(payload: DamagePayload): void;
    protected doDamage(payload: DamagePayload & {
        shooterPosition: Vector;
    }, damageResult: CombatLogDamageEntry, lastSection: SystemSection | null, inputArmorPiercing?: number, inputDamage?: number): void;
    protected findOverkillStructure(system: ShipSystem, ship: Ship): import("../../structure").Structure | null;
    protected doDamageToSystem(payload: DamagePayload, damageResult: CombatLogDamageEntry, hitSystem: ShipSystem, armorPiercing: number, damage: number): {
        armorPiercing: number;
        damage: number;
    };
    protected chooseHitSystem: ChooseHitSystemFunction<any>;
    protected getDamageForWeaponHit(payload?: DamagePayload): number;
    protected getArmorPiercing(payload?: DamagePayload): number;
}
export default StandardDamageStrategy;
