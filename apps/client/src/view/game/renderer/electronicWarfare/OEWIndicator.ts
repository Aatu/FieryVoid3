import * as THREE from "three";
import LineSprite, { LineType } from "../sprite/LineSprite";
import ShipObject from "../ships/ShipObject";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import {
  COLOR_OEW_ENEMY,
  COLOR_OEW_FRIENDLY,
} from "@fieryvoid3/model/src/config/gameConfig";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import Line from "../Line";

class OEWIndicator {
  protected scene: THREE.Object3D;
  public shipIcon: ShipObject;
  public targetIcon: ShipObject;
  public targetGhost: ShipObject | null;
  public shipGhost: ShipObject | null;
  protected amount: number;
  protected mine: boolean;
  protected visible: boolean;
  protected targetPosition: Vector;
  protected shipPosition: Vector;
  protected line: Line | LineSprite;

  constructor(
    shipIcon: ShipObject,
    targetIcon: ShipObject,
    targetGhost: ShipObject | null,
    shipGhost: ShipObject | null,
    amount: number,
    mine: boolean,
    scene: THREE.Object3D
  ) {
    this.scene = scene;
    this.shipIcon = shipIcon;
    this.targetIcon = targetIcon;
    this.targetGhost = targetGhost;
    this.shipGhost = shipGhost;
    this.amount = amount;
    this.mine = mine;

    this.visible = false;

    this.targetPosition =
      !this.targetGhost || this.targetGhost.isHidden()
        ? targetIcon.getPosition()
        : this.targetGhost.getPosition();

    this.shipPosition =
      !this.shipGhost || this.shipGhost.isHidden()
        ? this.shipIcon.getPosition()
        : this.shipGhost.getPosition();

    this.line = this.createLine();
  }

  createLine(): Line | LineSprite {
    const line = new LineSprite(
      this.shipIcon.getPosition().setZ(this.getZ()),
      this.targetPosition.setZ(this.getZ()),
      this.amount * 1 + 5,
      {
        color: this.mine ? COLOR_OEW_FRIENDLY : COLOR_OEW_ENEMY,
        opacity: 0.5,
        type: LineType.DASHED_CIRCLE,
        textureSize: this.amount * 1 + 5,
        //minFilter: THREE.NearestFilter,
        pulseAmount: 1,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(payload: RenderPayload) {
    if (!this.visible) {
      return;
    }

    //this.line.render(zoom);

    const newTargetPosition =
      !this.targetGhost || this.targetGhost.isHidden()
        ? this.targetIcon.getPosition()
        : this.targetGhost.getPosition();

    const newShipPosition =
      !this.shipGhost || this.shipGhost.isHidden()
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

      if (this.line && this.line instanceof LineSprite) {
        this.line.updateTextureSize(this.amount * 1 + 5);
      }
    }
  }

  update(ship: Ship, amount: number) {
    if (this.amount !== amount) {
      this.amount = amount;
      this.line.update(
        this.shipPosition.setZ(this.getZ()),
        this.targetPosition.setZ(this.getZ()),
        this.amount * 1 + 5
      );

      if (this.line && this.line instanceof LineSprite) {
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
