import UiStrategy from "./UiStrategy";
import * as THREE from "three";

class HighlightSelectedShip extends UiStrategy {
  constructor() {
    super();

    this.active = false;
    this.activeTime = 0;
    this.icon = null;
    //currentOpacity = opacity + (sineAmplitude * 0.5 * sin(gameTime/sineFrequency) + sineAmplitude)
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    if (this.icon) {
      this.icon.revertEmissive();
      shipIconContainer.getGhostShipIconByShip(this.icon.ship).revertOpacity();
    }
  }

  shipSelected(ship) {
    const { shipIconContainer } = this.services;
    this.active = true;
    this.activeTime = 0;
    this.icon = shipIconContainer.getByShip(ship);
  }

  shipDeselected(ship) {
    const { shipIconContainer } = this.services;
    this.active = true;
    this.activeTime = 0;

    if (this.icon) {
      this.icon.revertEmissive();
      shipIconContainer.getGhostShipIconByShip(this.icon.ship).revertOpacity();
    }
    this.icon = null;
  }

  render({ delta }) {
    const { shipIconContainer } = this.services;

    if (!this.active) {
      return;
    }

    const sineAmplitude = 1;
    const sineFrequency = 200;

    let opacity =
      0.5 * Math.sin(this.activeTime / sineFrequency) + sineAmplitude * 0.5;
    opacity = 0.2 + 0.6 * opacity;

    const ghost = shipIconContainer.getGhostShipIconByShip(this.icon.ship);

    if (ghost.hidden) {
      this.icon.replaceEmissive(
        new THREE.Color(
          (39 * opacity) / 255,
          (196 * opacity) / 255,
          (39 * opacity) / 255
        )
      );
    }

    ghost.replaceOpacity(opacity);
    this.activeTime += delta;
  }
}

export default HighlightSelectedShip;
