import ShipSystem from "../ShipSystem";

export type SerializedSystemLogEntry = {
  className?: string;
  messages?: string[];
  turn?: number | null;
};

class ShipSystemLogEntry {
  protected system: ShipSystem;
  public turn: number | null;
  protected messages: string[];

  constructor(system: ShipSystem) {
    this.system = system;
    this.turn = null;

    this.messages = [];
  }

  setTurn(turn: number) {
    this.turn = turn;
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  getMessage() {
    return this.messages;
  }

  isOpen() {
    return this.turn === null;
  }

  isTurn(turn: number) {
    return this.turn === turn;
  }

  serialize(): SerializedSystemLogEntry {
    return {
      className: this.constructor.name,
      messages: this.messages,
      turn: this.turn,
    };
  }

  deserialize(data: SerializedSystemLogEntry = {}) {
    this.turn = data.turn || null;
    this.messages = data.messages || [];

    return this;
  }
}

export default ShipSystemLogEntry;
