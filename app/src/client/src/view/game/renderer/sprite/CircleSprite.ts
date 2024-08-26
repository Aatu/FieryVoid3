import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawCircleAndFill } from "../../utils/graphics";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

let texture: THREE.Texture | null = null;
const TEXTURE_SIZE = 256;

const createTexture = () => {
  if (texture) {
    return;
  }

  const canvas = abstractCanvas.create(TEXTURE_SIZE, TEXTURE_SIZE);
  const context: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  context.strokeStyle = "rgba(255,255,255,1.0)";
  context.fillStyle = "rgba(255,255,255,0.5)";

  drawCircleAndFill(
    context,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE * 0.3,
    4
  );

  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
};

class CircleSprite extends Sprite {
  constructor(
    position: IVector,
    size: { width: number; height: number },
    z: number,
    opacity: number
  ) {
    super(null, size, z);

    this.setOpacity(opacity);

    createTexture();

    this.uniforms.uTexture.value = texture!;
    this.setPosition(position);
  }
}

export default CircleSprite;
