class ShipSystemLogEntry {
  constructor(system) {
    this.system = system;
    this.turn = null;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  getMessage() {
    return [];
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
      turn: this.turn
    };
  }

  deserialize(data = {}) {
    this.turn = data.turn || null;

    return this;
  }
}

export default ShipSystemLogEntry;
