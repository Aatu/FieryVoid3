import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes";
import ExplosiveDamageStrategy from "../../../../strategy/weapon/ExplosiveDamageStrategy";
import { DamagePayload } from "../../../../strategy/weapon/StandardDamageStrategy";
declare class HETorpedoDamageStrategy extends ExplosiveDamageStrategy {
    constructor(damageFormula: string | number, armorPiercingFormula: string | number, numberOfHitsFormula: string | number);
    getAttackRunMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getDamageMessage(): string;
    getArmorPiercingMessage(): string;
    getStrikeDistance(): number;
    applyDamageFromWeaponFire(payload: DamagePayload): void;
}
export default HETorpedoDamageStrategy;
