import GameTerrainEntity from "../game/GameTerrainEntity.mjs";
import TerrainMovementOrder from "../movement/TerrainMovementOrder";
import hexagon from "../hexagon";

class Sun extends GameTerrainEntity {
  constructor(id) {
    super({
      id,
      move: new TerrainMovementOrder(
        new hexagon.Offset(0, 0),
        new hexagon.Offset(0, 0)
      )
    });
  }
}

export default Sun;
