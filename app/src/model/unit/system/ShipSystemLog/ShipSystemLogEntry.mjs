class ShipSystemLogEntry {
  constructor(system) {
    this.system = system;
    this.turn = null;

    this.messages = [];
  }

  setTurn(turn) {
    this.turn = turn;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  getMessage() {
    return this.messages;
  }

  isOpen() {
    return this.turn === null;
  }

  isTurn(turn) {
    return this.turn === turn;
  }

  serialize() {
    return {
      className: this.constructor.name,
      messages: this.messages,
      turn: this.turn
    };
  }

  deserialize(data = {}) {
    this.turn = data.turn || null;
    this.messages = data.messages || [];

    return this;
  }
}

export default ShipSystemLogEntry;
