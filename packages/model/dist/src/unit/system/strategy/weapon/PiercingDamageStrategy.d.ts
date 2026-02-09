import StandardDamageStrategy, { ChooseHitSystemFunction, StandardDamagePayload } from "./StandardDamageStrategy";
import { SystemMessage } from "../types/SystemHandlersTypes";
import Vector from "../../../../utils/Vector";
import ShipSystem from "../../ShipSystem";
import SystemSection from "../../systemSection/SystemSection";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
declare class PiercingDamageStrategy extends StandardDamageStrategy {
    constructor(damageFormula: string | number, armorPiercingFormula: string | number);
    getDamageTypeMessage(): string;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    protected chooseHitSystem: ChooseHitSystemFunction<{
        systemsHit: ShipSystem[];
    }>;
    protected doDamage(payload: StandardDamagePayload & {
        shooterPosition: Vector;
    }, damageResult: CombatLogDamageEntry, lastSection: SystemSection | null, armorPiercing?: number, inputDamage?: number, shotsResolved?: number, systemsHit?: ShipSystem[]): void;
}
export default PiercingDamageStrategy;
