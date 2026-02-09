import ElectornicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry";
import Ship from "./Ship";
import { SerializedElectronicWarfareEntry } from "../electronicWarfare/ElectronicWarfareEntry";
import { EW_TYPE } from "../electronicWarfare/electronicWarfareTypes";
export type SearializedShipCurrentElectronicWarfare = {
    dew?: number;
    ccew?: number;
    entries?: SerializedElectronicWarfareEntry[];
};
declare class ShipCurrentElectronicWarfare {
    dew: number;
    ccew: number;
    entries: ElectornicWarfareEntry[];
    constructor(dew: number, ccew: number, entries: ElectornicWarfareEntry[]);
    serialize(): SearializedShipCurrentElectronicWarfare;
    deserialize(data?: SearializedShipCurrentElectronicWarfare): this;
    getDefensiveEw(): number;
    getCcEw(): number;
    getOffensiveEw(target: Ship | string): number;
    getAllOew(): ElectornicWarfareEntry[];
    getFromEntries(type: EW_TYPE, target: Ship | string): number;
}
export default ShipCurrentElectronicWarfare;
