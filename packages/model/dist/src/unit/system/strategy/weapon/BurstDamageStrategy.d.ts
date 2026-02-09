import StandardDamageStrategy, { DamagePayload } from "./StandardDamageStrategy";
import { SystemMessage } from "../types/SystemHandlersTypes";
declare class BurstDamageStrategy extends StandardDamageStrategy {
    shotsFormula: number | string;
    maxShots: number;
    grouping: number;
    constructor(damageFormula: number | string | null, armorPiercingFormula: number | string | null, shotsFormula?: number | string, maxShots?: number, grouping?: number);
    getTotalBurstSize(): number;
    applyDamageFromWeaponFire(payload: DamagePayload): void;
    protected getDamageTypeMessage(): string;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    private getNumberOfShots;
}
export default BurstDamageStrategy;
