import MovementOrder from "./MovementOrder";
import movementTypes from "./movementTypes";

class TerrainMovementOrder extends MovementOrder {
  constructor(position, target, turn = 1) {
    super(null, mvementTypes.END, position, target, 1, false, turn);
  }
}

export default TerrainMovementOrder;
