import { ShipMapSprite } from "../sprite";

class ShipMapIcon {
  constructor(icon) {
    this.icon = icon;

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
    this.sprite.mesh.userData = { icon };
    this.sprite.hide();
    this.normalSprite.hide();
    this.movementTargetSprite.hide();

    this.scene = null;
  }

  setMovementTarget() {
    this.scene.remove(this.sprite.mesh);
    this.sprite = this.movementTargetSprite;
    this.scene.add(this.sprite.mesh);
    return this;
  }

  replaceColor(color) {
    this.sprite.replaceColor(color);
    return this;
  }

  revertColor() {
    this.sprite.revertColor(this.color);
    return this;
  }

  addTo(scene) {
    this.scene = scene;
    scene.add(this.sprite.mesh);
  }

  setScale(scale) {
    this.sprite.setScale(scale, scale);
    return this;
  }

  setRotation(rotation) {
    this.normalSprite.setFacing(rotation);
    this.movementTargetSprite.setFacing(rotation);
    return this;
  }

  setOverlayColor(color) {
    this.sprite.setOverlayColor(color);
    return this;
  }

  setOverlayColorAlpha(alpha) {
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
