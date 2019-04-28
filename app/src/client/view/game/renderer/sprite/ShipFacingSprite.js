import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawArrow } from "../../utils/graphics";

let texture = null;
const TEXTURE_SIZE = 256;

const createTexture = () => {
  if (texture) {
    return;
  }

  const canvas = abstractCanvas.create(TEXTURE_SIZE, TEXTURE_SIZE);
  const context = canvas.getContext("2d");
  context.strokeStyle = "rgba(0,0,255,1.0)";
  context.fillStyle = "rgba(0,0,255,0.5)";

  drawArrow(
    context,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE / 2,
    0,
    TEXTURE_SIZE / 2,
    1
  );

  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
};

class ShipFacingSprite extends Sprite {
  constructor(size, z, opacity) {
    super(null, size, z);

    this.setOpacity(opacity);

    createTexture();
    this.uniforms.texture.value = texture;
  }
}

export default ShipFacingSprite;
