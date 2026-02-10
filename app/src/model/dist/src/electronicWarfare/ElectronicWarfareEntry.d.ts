import { EW_TYPE } from "./electronicWarfareTypes";
export type SerializedElectronicWarfareEntry = {
    type: EW_TYPE;
    targetShipId: string;
    amount: number;
};
declare class ElectronicWarfareEntry {
    type: EW_TYPE;
    targetShipId: string;
    amount: number;
    constructor(type: EW_TYPE, targetShipId: string, amount: number);
    clone(): ElectronicWarfareEntry;
    addAmount(amount: number): void;
    getAmount(): number;
    getType(): EW_TYPE;
    getActualPower(): number;
    getEfficiency(): 1 | 3 | 2.5;
    serialize(): SerializedElectronicWarfareEntry;
    deserialize(data: SerializedElectronicWarfareEntry): this;
}
export default ElectronicWarfareEntry;
