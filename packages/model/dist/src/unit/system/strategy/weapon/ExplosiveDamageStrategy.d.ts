import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import Vector from "../../../../utils/Vector";
import { SystemMessage } from "../types/SystemHandlersTypes";
import StandardDamageStrategy, { DamagePayload } from "./StandardDamageStrategy";
declare class ExplosiveDamageStrategy extends StandardDamageStrategy {
    private numberOfDamagesFormula;
    constructor(damageFormula: number | string, armorPiercingFormula: number | string, numberOfDamagesFormula?: number | string);
    protected getDamageTypeMessage(): string;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    protected getNumberOfDamagesForWeaponHit(): number;
    protected doDamage(payload: DamagePayload & {
        shooterPosition: Vector;
    }, damageResult: CombatLogDamageEntry): void;
}
export default ExplosiveDamageStrategy;
