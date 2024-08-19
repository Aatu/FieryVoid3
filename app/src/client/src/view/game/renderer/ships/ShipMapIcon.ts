import { ShipMapSprite } from "../sprite";
import ShipObject from "./ShipObject";
import * as THREE from "three";

class ShipMapIcon {
  private shipObject: ShipObject;
  private size: { width: number; height: number };
  private normalSprite: ShipMapSprite;
  private movementTargetSprite: ShipMapSprite;
  private sprite: ShipMapSprite;
  private scene: THREE.Object3D | null;

  constructor(shipObject: ShipObject) {
    this.shipObject = shipObject;

    this.size = { width: 25, height: 25 };

    this.normalSprite = new ShipMapSprite(
      { x: 0, y: 0, z: 0 },
      this.size,
      0,
      1
    );
    this.movementTargetSprite = new ShipMapSprite(
      { x: 0, y: 0, z: 0 },
      { width: 30, height: 30 },
      0,
      1,
      true
    );

    this.sprite = this.normalSprite;
    this.sprite.getMesh().userData = {
      icon: shipObject,
      shioObject: shipObject,
    };
    this.sprite.hide();
    this.normalSprite.hide();
    this.movementTargetSprite.hide();

    this.scene = null;
  }

  getScene() {
    if (!this.scene) {
      throw new Error("Scene not set");
    }

    return this.scene;
  }

  setMovementTarget() {
    this.getScene().remove(this.sprite.getMesh());
    this.sprite = this.movementTargetSprite;
    this.getScene().add(this.sprite.getMesh());
    return this;
  }

  replaceColor(color: THREE.Color) {
    this.sprite.replaceColor(color);
    return this;
  }

  revertColor() {
    this.sprite.revertColor();
    return this;
  }

  addTo(scene: THREE.Object3D) {
    this.scene = scene;
    scene.add(this.sprite.getMesh());
  }

  setScale(scale: number) {
    this.sprite.setScale(scale, scale);
    return this;
  }

  setRotation(rotation: number) {
    this.normalSprite.setFacing(rotation);
    this.movementTargetSprite.setFacing(rotation);
    return this;
  }

  setOverlayColor(color: THREE.Color) {
    this.sprite.setOverlayColor(color);
    return this;
  }

  setOverlayColorAlpha(alpha: number) {
    this.sprite.setOverlayColorAlpha(alpha);
    return this;
  }

  show() {
    this.sprite.show();
    return this;
  }

  hide() {
    this.sprite.hide();
    return this;
  }
}

export default ShipMapIcon;
