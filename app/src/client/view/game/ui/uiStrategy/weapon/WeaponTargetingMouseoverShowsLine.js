import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import Line from "../../../renderer/Line";

class WeaponTargetingMouseoverShowsLine extends UiStrategy {
  constructor() {
    super();

    this.lines = [];
  }

  systemMouseOver({ ship, target }) {
    this.show(ship, target);
  }

  torpedoMouseOver({ ship, target }) {
    this.show(ship, target);
  }

  systemMouseOut() {
    this.hide();
  }

  torpedoMouseOut() {
    this.hide();
  }

  hide() {
    this.lines.forEach(line => line.destroy());
    this.lines = [];
  }

  show(shooter, target) {
    if (!target) {
      return;
    }

    const { scene, shipIconContainer } = this.services;

    const shooterIcon = shipIconContainer.getByShip(shooter);
    const targetIcon = shipIconContainer.getByShip(target);

    const line = new Line(scene, {
      start: { ...shooterIcon.getPosition(), z: shooterIcon.shipZ },
      end: { ...targetIcon.getPosition(), z: targetIcon.shipZ },
      width: 10,
      color: new THREE.Color(196 / 255, 196 / 255, 39 / 255),
      opacity: 0.1,
      pulseAmount: 1,
      dashSize: 0
    });

    this.lines.push(line);
  }
  deactivate() {
    const { uiState } = this.services;
    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    if (this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
    }
  }
}

export default WeaponTargetingMouseoverShowsLine;
