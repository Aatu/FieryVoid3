import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../../renderer/ships/ShipObject";
import UiStrategy from "./UiStrategy";
import * as THREE from "three";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import { COLOR_FRIENDLY_HIGHLIGHT } from "@fieryvoid3/model/src/config/gameConfig";

class HighlightSelectedShip extends UiStrategy {
  private active: boolean = false;
  private activeTime: number = 0;
  private icon: ShipObject | null = null;

  hide() {
    const { shipIconContainer } = this.getServices();
    if (this.icon) {
      this.icon.revertEmissive();
      this.icon.mapIcon?.revertColor();
      this.icon.hexSprites.forEach((sprite) => sprite.revertColor());
      const ghost = shipIconContainer.getGhostShipIconByShip(this.icon.ship);
      //ghost.revertOpacity();
      ghost.mapIcon?.setMovementTarget();
      ghost.mapIcon?.revertColor();
    }

    this.icon = null;
  }

  deactivate() {
    this.hide();
  }

  shipSelected({ ship }: { ship: Ship }) {
    const { shipIconContainer } = this.getServices();
    this.active = true;
    this.activeTime = 0;
    this.icon = shipIconContainer.getByShip(ship);
  }

  shipDeselected() {
    this.active = true;
    this.activeTime = 0;

    this.hide();
  }

  render({ delta }: RenderPayload) {
    const { shipIconContainer } = this.getServices();

    if (!this.active || !this.icon) {
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
    const ghostColor = COLOR_FRIENDLY_HIGHLIGHT.clone().add(
      new THREE.Color(1, 1, 1).multiplyScalar(opacity)
    );

    this.icon.replaceEmissive(color);

    ghost.setGhostShipEmissive(ghostColor);
    //ghost.replaceOpacity(opacity);
    ghost.mapIcon
      ?.setMovementTarget()
      .replaceColor(color)
      .setOverlayColorAlpha(1);
    this.icon.hexSprites.forEach((sprite) =>
      sprite.replaceColor(color.clone())
    );
    this.icon.mapIcon?.replaceColor(color);
    this.activeTime += delta;
  }
}

export default HighlightSelectedShip;
