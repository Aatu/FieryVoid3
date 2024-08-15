import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawDottedCircle } from "../../utils/graphics";

let texture = null;
const TEXTURE_SIZE = 512;

const createTexture = () => {
  if (texture) {
    return;
  }

  const canvas = abstractCanvas.create(TEXTURE_SIZE, TEXTURE_SIZE);
  const context = canvas.getContext("2d");
  context.strokeStyle = "rgba(78,220,25,1.0)";
  context.fillStyle = "rgba(78,220,25,0.5)";

  drawDottedCircle(
    context,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE * 0.4,
    TEXTURE_SIZE * 0.5,
    12,
    0.3
  );

  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
};

class DottedCircleSprite extends Sprite {
  constructor(size, z, opacity) {
    super(null, size, z);

    this.setOpacity(opacity);

    createTexture();
    this.uniforms.texture.value = texture;
  }
}

export default DottedCircleSprite;
