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

  deactivate() {}

  shipSelected(ship) {
    const { shipIconContainer } = this.services;
    this.active = true;
    this.activeTime = 0;
    this.icon = shipIconContainer.getByShip(ship);
  }

  shipDeselected(ship) {
    this.active = true;
    this.activeTime = 0;

    if (this.icon) {
      this.icon.revertEmissive();
    }
    this.icon = null;
  }

  render({ delta }) {
    if (!this.active) {
      return;
    }

    const sineAmplitude = 1;
    const sineFrequency = 200;

    const opacity =
      0.5 * Math.sin(this.activeTime / sineFrequency) + sineAmplitude * 0.5;

    this.icon.replaceEmissive(
      new THREE.Color(
        (39 * opacity) / 255,
        (196 * opacity) / 255,
        (39 * opacity) / 255
      )
    );

    this.activeTime += delta;
  }
}

export default HighlightSelectedShip;
