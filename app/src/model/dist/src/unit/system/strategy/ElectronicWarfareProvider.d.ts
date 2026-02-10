import ShipSystemStrategy from "./ShipSystemStrategy";
import ElectronicWarfareEntry from "../../../electronicWarfare/ElectronicWarfareEntry";
import Ship from "../../Ship";
import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import { SerializedElectronicWarfareEntry } from "../../../electronicWarfare/ElectronicWarfareEntry";
import { SystemMessage } from "./types/SystemHandlersTypes";
import { CriticalTableEntry } from "../criticals";
export type SerializedElectronicWarfareProvider = {
    electronicWarfareProvider?: SerializedElectronicWarfareEntry[];
};
declare class ElectronicWarfareProvider extends ShipSystemStrategy {
    private output;
    private allowedEwTypes;
    private entries;
    constructor(output: number, allowedEwTypes: EW_TYPE[]);
    serialize(payload: unknown, previousResponse?: {}): {
        electronicWarfareProvider: SerializedElectronicWarfareEntry[];
    };
    deserialize(data?: SerializedElectronicWarfareProvider): this;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getUsageVsOutputText(): string;
    getValidEwTypes(): EW_TYPE[];
    getEwEntry(type: EW_TYPE, targetId: string): ElectronicWarfareEntry | undefined;
    assignEw({ type, target, amount, }: {
        type: EW_TYPE;
        target: Ship | string;
        amount: number;
    }): void;
    getEwEntries(): ElectronicWarfareEntry[];
    canUseEw({ type, amount }: {
        type: EW_TYPE;
        amount: number;
    }): boolean;
    canUseEwType(type: EW_TYPE): boolean;
    canUseEwAmount(amount: number): boolean;
    getUnusedCapacity(): number;
    getTotalEwUsedByType(type: EW_TYPE): number;
    getTotalEwUsed(): number;
    getOutputForBoost(payload: unknown, previousResponse?: number): number;
    getEwOutput(payload?: unknown, previousResponse?: number): number;
    isEwArray(payload: unknown, previousResponse?: boolean): boolean;
    resetEw(): void;
    getPossibleCriticals(payload: unknown, previousResponse?: CriticalTableEntry[]): CriticalTableEntry[];
    censorForUser({ mine }: {
        mine: boolean;
    }): void;
    onSystemOffline(): void;
    onSystemPowerLevelDecrease(): void;
}
export default ElectronicWarfareProvider;
