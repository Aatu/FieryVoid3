import MovementOrder from "./MovementOrder.mjs";
import MovementTypes from "./MovementTypes";

class TerrainMovementOrder extends MovementOrder {
  constructor(position, target, turn = 1) {
    super(null, MovementTypes.END, position, target, 1, false, turn);
  }
}

export default TerrainMovementOrder;
