import StandardDamageStrategy, { DamagePayload } from "../../../../strategy/weapon/StandardDamageStrategy";
import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes";
import TorpedoFlight from "../../../../../TorpedoFlight";
import Ship from "../../../../../Ship";
import CombatLogTorpedoAttack from "../../../../../../combatLog/CombatLogTorpedoAttack";
export type MSVTorpedoDamageStrategyDamagePayload = DamagePayload & {
    torpedoFlight: TorpedoFlight;
    combatLogEntry: CombatLogTorpedoAttack;
};
export declare const isMSVTorpedoDamagePayload: (payload: DamagePayload) => payload is MSVTorpedoDamageStrategyDamagePayload;
declare class MSVTorpedoDamageStrategy extends StandardDamageStrategy {
    rangePenalty: number;
    numberOfShots: number;
    strikeHitChance: number;
    minStrikeDistance: number;
    msv: boolean;
    constructor(damageFormula: string | number, armorPiercingFormula: string | number, rangePenalty: number, numberOfShots: number, strikeHitChance?: number, minStrikeDistance?: number);
    getAttackRunMessages(payload: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
    }, previousResponse?: SystemMessage[]): SystemMessage[];
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    _getDamageForWeaponHit({ torpedoFlight }: {
        torpedoFlight: TorpedoFlight;
    }): number;
    _getArmorPiercing({ torpedoFlight }: {
        torpedoFlight: TorpedoFlight;
    }): number;
    getHitChance({ target, torpedoFlight, distance, }: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
        distance: number;
    }): number;
    getStrikeDistance(payload: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
    }): number;
    applyDamageFromWeaponFire(payload: DamagePayload): void;
}
export default MSVTorpedoDamageStrategy;
