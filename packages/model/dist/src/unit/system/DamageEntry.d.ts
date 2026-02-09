import ShipSystem from "./ShipSystem";
export type SerializedDamageEntry = {
    amount: number;
    armor: number;
    id: string;
    destroyedSystem: boolean;
};
declare class DamageEntry {
    amount: number;
    armor: number;
    id: string;
    destroyedSystem: boolean;
    system: ShipSystem | null;
    new: boolean;
    constructor(amount?: number, armor?: number);
    isNew(): boolean;
    setSystem(system: ShipSystem): void;
    setDestroyedSystem(): void;
    serialize(): SerializedDamageEntry;
    deserialize(data: SerializedDamageEntry): this;
    getDamage(): number;
    advanceTurn(): this;
}
export default DamageEntry;
