class ShipSystemLogEntry {
  constructor(message) {
    this.message = message;
    this.turn = null;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  getMessage() {
    return this.message;
  }

  serialize() {
    return {
      className: this.constructor.name,
      message: this.message,
      turn: this.turn
    };
  }

  deserialize(data = {}) {
    this.message = data.message || "";
    this.turn = data.turn || null;

    return this;
  }
}

export default ShipSystemLogEntry;
