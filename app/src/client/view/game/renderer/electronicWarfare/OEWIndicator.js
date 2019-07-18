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
    this.mine = mine;

    this.visible = false;

    this.targetPosition = this.targetGhost.hidden
      ? targetIcon.getPosition()
      : targetGhost.getPosition();

    this.shipPosition = this.shipIcon.getPosition();

    this.line = this.createLine();
  }

  createLine() {
    return new Line(this.scene, {
      start: { ...this.shipIcon.getPosition(), z: this.getZ() },
      end: { ...this.targetPosition, z: this.getZ() },
      width: this.amount * 1 + 5,
      color: this.mine ? COLOR_OEW_FRIENDLY : COLOR_OEW_ENEMY,
      opacity: 0.1,
      pulseAmount: 1,
      dashSize: 5
    });
  }

  getZ() {
    return 0;
  }

  remove() {
    this.line.destroy();
  }

  render() {
    if (!this.visible) {
      return;
    }

    const newTargetPosition = this.targetGhost.hidden
      ? this.targetIcon.getPosition()
      : this.targetGhost.getPosition();
    const newShipPosition = this.shipIcon.getPosition();
    if (
      !this.shipPosition.equals(newShipPosition) ||
      !this.targetPosition.equals(newTargetPosition)
    ) {
      this.shipPosition = newShipPosition;
      this.targetPosition = newTargetPosition;
      this.line.update(
        { ...this.shipPosition, z: this.getZ() },
        { ...this.targetPosition, z: this.getZ() },
        this.amount * 1 + 5
      );
    }
  }

  update(ship, amount) {
    this.ship = ship;

    if (this.amount !== amount) {
      this.amount = amount;
      this.line.update(
        { ...this.shipPosition, z: this.getZ() },
        { ...this.targetPosition, z: this.getZ() },
        this.amount * 1 + 5
      );
    }

    return this;
  }

  show() {
    this.visible = true;
    this.line.show();
  }

  hide() {
    this.visible = false;
    this.line.hide();
  }
}

export default OEWIndicator;
