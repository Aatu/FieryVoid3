import {
  ShipIdleMovementAnimation,
  ShipSystemAnimation
} from "../../animation";

import AnimationUiStrategy from "./AnimationUiStrategy";

class ShowShipObjects extends AnimationUiStrategy {
  constructor() {
    super();
  }

  update(gamedata) {
    super.update(gamedata);
    const { shipIconContainer } = this.services;

    shipIconContainer.getArray().forEach(icon => {
      const ship = icon.ship;

      if (ship.isDestroyed()) {
        icon.hide();
      } else {
        icon.show();
        this.animations.push(
          new ShipIdleMovementAnimation(icon, gamedata.terrain)
        );
        this.animations.push(new ShipSystemAnimation(icon));
      }
      return this;
    });
  }

  shipStateChanged(ship) {
    this.animations
      .filter(animation => animation.ship === ship)
      .forEach(animation => {
        animation.update();
      });
  }

  shipSystemStateChanged({ ship, system }) {
    this.animations
      .filter(animation => animation.ship === ship)
      .forEach(animation => {
        if (animation.updateSystem) {
          animation.updateSystem(system);
        }
      });
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ShowShipObjects;
