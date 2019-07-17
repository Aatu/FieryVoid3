import { ShipIdleMovementAnimation } from "../../animation";

import AnimationUiStrategy from "./AnimationUiStrategy";

class ShowShipObjects extends AnimationUiStrategy {
  constructor() {
    super();
  }

  update(gamedata) {
    super.update(gamedata);
    const { shipIconContainer, coordinateConverter } = this.services;

    shipIconContainer.getArray().forEach(icon => {
      const ship = icon.ship;

      if (ship.isDestroyed()) {
        icon.hide();
      } else {
        icon.show();
        this.animations.push(new ShipIdleMovementAnimation(icon));
      }
      return this;
    });
  }

  shipStateChanged(ship) {
    const animation = this.animations.find(
      animation => animation.ship === ship
    );

    animation.update();
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(function(icon) {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ShowShipObjects;
