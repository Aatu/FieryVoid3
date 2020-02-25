import * as THREE from "three";
import Line from "../Line";
import LineSprite from "../sprite/LineSprite";
import {
  COLOR_OEW_FRIENDLY,
  COLOR_OEW_ENEMY,
  COLOR_FRIENDLY_HIGHLIGHT
} from "../../../../../model/gameConfig.mjs";

class OEWIndicator {
  constructor(
    shipIcon,
    targetIcon,
    targetGhost,
    shipGhost,
    amount,
    mine,
    scene
  ) {
    this.scene = scene;
    this.shipIcon = shipIcon;
    this.targetIcon = targetIcon;
    this.targetGhost = targetGhost;
    this.shipGhost = shipGhost;
    this.amount = amount;
    this.mine = mine;

    this.visible = false;

    this.targetPosition = this.targetGhost.hidden
      ? targetIcon.getPosition()
      : targetGhost.getPosition();

    this.shipPosition = this.shipGhost.hidden
      ? this.shipIcon.getPosition()
      : this.shipGhost.getPosition();

    this.line = this.createLine();
  }

  createLine() {
    const line = new LineSprite(
      this.shipIcon.getPosition().setZ(this.getZ()),
      this.targetPosition.setZ(this.getZ()),
      this.amount * 1 + 5,
      {
        color: this.mine ? COLOR_OEW_FRIENDLY : COLOR_OEW_ENEMY,
        opacity: 0.5,
        type: "dashed-circle",
        textureSize: this.amount * 1 + 5,
        //minFilter: THREE.NearestFilter,
        pulseAmount: 1
      }
    );

    line.addTo(this.scene);

    return line;
  }

  getZ() {
    return 0;
  }

  remove() {
    this.line.destroy();
  }

  render(zoom) {
    if (!this.visible) {
      return;
    }

    //this.line.render(zoom);

    const newTargetPosition = this.targetGhost.hidden
      ? this.targetIcon.getPosition()
      : this.targetGhost.getPosition();

    const newShipPosition = this.shipGhost.hidden
      ? this.shipIcon.getPosition()
      : this.shipGhost.getPosition();

    if (
      !this.shipPosition.equals(newShipPosition) ||
      !this.targetPosition.equals(newTargetPosition)
    ) {
      this.shipPosition = newShipPosition;
      this.targetPosition = newTargetPosition;
      this.line.update(
        this.shipPosition.setZ(this.getZ()),
        this.targetPosition.setZ(this.getZ()),
        this.amount * 1 + 5
      );

      if (this.line && this.line.updateTextureSize) {
        this.line.updateTextureSize(this.amount * 1 + 5);
      }
    }
  }

  update(ship, amount) {
    this.ship = ship;

    if (this.amount !== amount) {
      this.amount = amount;
      this.line.update(
        this.shipPosition.setZ(this.getZ()),
        this.targetPosition.setZ(this.getZ()),
        this.amount * 1 + 5
      );

      if (this.line && this.line.updateTextureSize) {
        this.line.updateTextureSize(this.amount * 1 + 5);
      }
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
