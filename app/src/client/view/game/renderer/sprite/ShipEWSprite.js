import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawFilledCircle } from "../../utils/graphics";

const TEXTURE_SIZE = 256;

const drawDEW = (context, DEW) => {
  if (!DEW) {
    return;
  }

  var a = 0.4;

  if (DEW < 3) {
    a = 0.7;
  }

  context.strokeStyle = "rgba(144,185,208,0)";
  context.fillStyle = "rgba(144,185,208," + a + ")";

  var r1 = getDEWStart();
  var r2 = getDEWStart() + DEW * 4;

  drawFilledCircle(context, TEXTURE_SIZE / 2, TEXTURE_SIZE / 2, r1, r2);
};

const getDEWStart = () => {
  return Math.ceil(TEXTURE_SIZE * 0.31);
};

const getCCEWStart = DEW => {
  return Math.ceil(TEXTURE_SIZE * 0.32) + DEW * 4;
};

const drawCCEW = (context, DEW, CCEW) => {
  if (!CCEW) {
    return;
  }

  var a = 0.7;

  if (CCEW < 3) {
    a = 0.9;
  }

  context.strokeStyle = "rgba(20,80,128,0)";
  context.fillStyle = "rgba(20,80,128," + a + ")";

  var r1 = getCCEWStart(DEW);
  var r2 = getCCEWStart(DEW) + CCEW * 4;

  drawFilledCircle(context, TEXTURE_SIZE / 2, TEXTURE_SIZE / 2, r1, r2);
};

class ShipEWSprite extends Sprite {
  constructor(size, z) {
    super(null, size, z);
    this.DEW = 0;
    this.CCEW = 0;
  }

  update(DEW, CCEW) {
    if (this.DEW === DEW && this.CCEW === CCEW) {
      return;
    }

    this.DEW = DEW;
    this.CCEW = CCEW;

    const canvas = abstractCanvas.create(TEXTURE_SIZE, TEXTURE_SIZE);
    const context = canvas.getContext("2d");
    drawDEW(context, DEW);
    drawCCEW(context, DEW, CCEW);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    this.uniforms.texture.value = texture;
  }
}

export default ShipEWSprite;
