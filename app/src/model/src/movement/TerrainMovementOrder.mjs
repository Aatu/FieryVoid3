import MovementOrder from "./MovementOrder.mjs";
import movementTypes from "./movementTypes.mjs";

class TerrainMovementOrder extends MovementOrder {
  constructor(position, target, turn = 1) {
    super(null, mvementTypes.END, position, target, 1, false, turn);
  }
}

export default TerrainMovementOrder;
