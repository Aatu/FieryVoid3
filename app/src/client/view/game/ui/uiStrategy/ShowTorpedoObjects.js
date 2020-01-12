import AnimationUiStrategy from "./AnimationUiStrategy";
import { getCompassHeadingOfPoint } from "../../../../../model/utils/math.mjs";
import { getSeededRandomGenerator } from "../../../../../model/utils/math.mjs";
import Vector from "../../../../../model/utils/Vector.mjs";
import { TORPEDO_Z } from "../../../../../model/gameConfig.mjs";

class ShowTorpedoObjects extends AnimationUiStrategy {
  constructor() {
    super();
  }

  update(gamedata) {
    super.update(gamedata);
    const { torpedoIconContainer } = this.services;

    gamedata.torpedos.getTorpedoFlights().forEach(flight => {
      const icon = torpedoIconContainer.getIconByTorpedoFlight(flight);

      const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
      const variance = new Vector(getRandom() * 30 - 15, getRandom() * 30 - 15);

      icon.setPosition(flight.position.setZ(TORPEDO_Z).add(variance));
      icon.setFacing(
        -getCompassHeadingOfPoint(
          flight.position,
          flight.position.add(flight.velocity)
        )
      );

      icon.show();
    });
  }

  deactivate() {
    const { torpedoIconContainer } = this.services;
    torpedoIconContainer.getArray().forEach(icon => {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ShowTorpedoObjects;
