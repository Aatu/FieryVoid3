import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
export type SerializedFireOrder = {
    id?: string | null;
    shooterId: string;
    targetId: string;
    weaponId: number;
    weaponSettings: Record<string, unknown>;
    resolved: boolean;
};
declare class FireOrder {
    id: string | null;
    shooterId: string;
    targetId: string;
    weaponId: number;
    weaponSettings: Record<string, unknown>;
    resolved: boolean;
    static fromData(data: SerializedFireOrder): FireOrder;
    constructor(id: string | null, shooter: string | Ship, target: string | Ship, weapon: number | ShipSystem, weaponSettigs?: Record<string, unknown>, resolved?: boolean);
    setId(id: string | null): FireOrder;
    getId(): string;
    setResolved(): this;
    serialize(): SerializedFireOrder;
    deserialize(data: SerializedFireOrder): FireOrder;
}
export default FireOrder;
