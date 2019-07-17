import * as THREE from "three";
import Line from "../Line";

const COLOR_OEW_FRIENDLY = new THREE.Color(160 / 255, 150 / 255, 250 / 255);
const COLOR_OEW_ENEMY = new THREE.Color(255 / 255, 40 / 255, 40 / 255);

class OEWIndicator {
  constructor(shipIcon, targetIcon, targetGhost, amount, mine, scene) {
    this.scene = scene;
    this.shipIcon = shipIcon;
    this.targetIcon = targetIcon;
    this.targetGhost = targetGhost;
    this.amount = amount;

    this.targetPosition = this.targetGhost.hidden
      ? targetIcon.getPosition()
      : targetGhost.getPosition();

    this.line = new Line(scene, {
      start: { ...shipIcon.getPosition(), z: 0 },
      end: { ...this.targetPosition, z: 0 },
      width: amount * 3,
      color: mine ? COLOR_OEW_FRIENDLY : COLOR_OEW_ENEMY,
      opacity: 0.1,
      pulseAmount: 1,
      dashSize: 5
    });
  }

  remove() {
    this.line.destroy();
  }

  update(ship, amount) {
    this.ship = ship;
    const newTargetPosition = this.targetGhost.hidden
      ? this.targetIcon.getPosition()
      : this.targetGhost.getPosition();

    if (this.amount !== amount) {
      this.amount = amount;
      this.line.setLineWidth(this.amount * 3);
    }

    if (!this.targetPosition.equals(newTargetPosition)) {
      this.targetPosition = newTargetPosition;
      this.line.setEnd(this.targetPosition);
    }

    return this;
  }

  show() {
    this.line.show();
  }

  hide() {
    this.line.hide();
  }
}

export default OEWIndicator;
