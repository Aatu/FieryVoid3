import ShipSystem from "../ShipSystem";
export type SerializedSystemLogEntry = {
    className?: string;
    messages?: string[];
    turn?: number | null;
};
declare class ShipSystemLogEntry {
    protected system: ShipSystem;
    turn: number | null;
    protected messages: string[];
    constructor(system: ShipSystem);
    setTurn(turn: number): void;
    addMessage(message: string): void;
    getMessage(): string[];
    isOpen(): boolean;
    isTurn(turn: number): boolean;
    serialize(): SerializedSystemLogEntry;
    deserialize(data?: SerializedSystemLogEntry): this;
}
export default ShipSystemLogEntry;
