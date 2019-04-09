import MovementOrder from "../movement/MovementOrder.mjs"
class ShipMovement {
  constructor() {
    this.moves = [];
  }

  deserialize(data = []) {
    this.moves = data.map(moveData => new MovementOrder().deserialize(moveData));
  }

  serialize() {
    return this.moves.map(move => move.serialize());
  }
}

export default ShipMovement;
