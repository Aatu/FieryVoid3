import Ship from "../../../../../Ship";
import { SystemMessage } from "../../../../strategy/types/SystemHandlersTypes";
import { CombatLogEntry, UnifiedDamagePayload, UnifiedDamageStrategy, UnifiedDamageStrategyArgs } from "../../../../strategy/weapon/UnifiedDamageStrategy";
import HitSystemRandomizer from "../../../../strategy/weapon/utils/HitSystemRandomizer";
import TorpedoFlight from "../../../../../TorpedoFlight";
import { DiceRoller, DiceRollFormula } from "../../../../../../utils/DiceRoller";
export type TorpedoDamagePayload = {
    target: Ship;
    torpedoFlight: TorpedoFlight;
    combatLogEntry: CombatLogEntry;
    diceRoller?: DiceRoller;
    hitSystemRandomizer?: HitSystemRandomizer;
};
type TorpedoDamageStrategyMsVArgs = {
    msvAmount: DiceRollFormula;
    msvRangePenalty: number;
    msvStrikeHitChanceTarget: number;
    msvMinStrikeDistance: number;
    msvHitBonus: number;
    msvEvasionModifier: number;
};
declare class TorpedoDamageStrategy {
    protected damageStrategy: UnifiedDamageStrategy;
    protected msvAmount: DiceRollFormula;
    protected msvRangePenalty: number;
    protected msvStrikeHitChanceTarget: number;
    protected msvMinStrikeDistance: number;
    protected hitBonus: number;
    protected evasionModifier: number;
    constructor(args: Partial<UnifiedDamageStrategyArgs>, msvArgs?: Partial<TorpedoDamageStrategyMsVArgs>);
    isMsv(): boolean;
    getMsvAmount(): DiceRollFormula;
    getAttackRunMessages(payload: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
    }, previousResponse?: SystemMessage[]): SystemMessage[];
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getStrikeDistance(payload: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
    }): number;
    private getHitChance;
    applyDamageFromWeaponFire(payload: TorpedoDamagePayload): void;
    private applyDamageFromMSVTorpedo;
    applyDamageFromNormalTorpedo(payload: UnifiedDamagePayload): void;
}
export default TorpedoDamageStrategy;
