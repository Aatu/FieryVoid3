import UiStrategy from "./UiStrategy";
import * as THREE from "three";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  COLOR_FRIENDLY_HIGHLIGHT,
  COLOR_ENEMY_HIGHLIGHT
} from "../../../../../model/gameConfig.mjs";

class HighlightSelectedShip extends UiStrategy {
  constructor() {
    super();

    this.active = false;
    this.activeTime = 0;
    this.icon = null;
    //currentOpacity = opacity + (sineAmplitude * 0.5 * sin(gameTime/sineFrequency) + sineAmplitude)
  }

  hide() {
    const { shipIconContainer } = this.services;
    if (this.icon) {
      this.icon.revertEmissive();
      this.icon.mapIcon.revertColor();
      this.icon.hexSprites.forEach(sprite => sprite.revertColor());
      const ghost = shipIconContainer.getGhostShipIconByShip(this.icon.ship);
      ghost.revertOpacity();
      ghost.mapIcon.setMovementTarget();
      ghost.mapIcon.revertColor();
    }

    this.icon = null;
  }

  deactivate() {
    this.hide();
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

    this.hide();
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

    //if (ghost.hidden) {

    const color = COLOR_FRIENDLY_HIGHLIGHT.clone().multiplyScalar(opacity);

    this.icon.replaceEmissive(color);

    ghost.setGhostShipEmissive(color);
    ghost.replaceOpacity(opacity);
    ghost.mapIcon
      .setMovementTarget()
      .replaceColor(color)
      .setOverlayColorAlpha(1);
    this.icon.hexSprites.forEach(sprite => sprite.replaceColor(color.clone()));
    this.icon.mapIcon.replaceColor(color);
    this.activeTime += delta;
  }
}

export default HighlightSelectedShip;
