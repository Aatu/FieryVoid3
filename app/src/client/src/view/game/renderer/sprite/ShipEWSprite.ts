import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawFilledEllipse } from "../../utils/graphics";

const TEXTURE_SIZE = 1028;

const getDEWWidth = (DEW: number) => {
  if (DEW === 0) {
    return 0;
  }

  return DEW * 3 + 5;
};

const getEvasionWidth = (evasion: number) => {
  if (evasion === 0) {
    return 0;
  }

  return evasion * 3 + 5;
};

const getCCEWWidth = (CCEW: number) => {
  if (CCEW === 0) {
    return 0;
  }

  return CCEW * 3 + 5;
};

const drawDEW = (
  context: CanvasRenderingContext2D,
  DEW: number,
  ratios: { x: number; y: number }
) => {
  if (!DEW) {
    return;
  }

  /*
  let a = 0.4;

  if (DEW < 3) {
    a = 0.7;
  }
*/

  context.strokeStyle = "rgba(144,185,208, 0.7)";
  context.lineWidth = getDEWWidth(DEW);

  const { r1, r2 } = getDEWRadiuses(DEW, ratios);
  drawFilledEllipse(context, TEXTURE_SIZE / 2, TEXTURE_SIZE / 2, r1, r2);
};

const getDEWRadiuses = (DEW: number, ratios: { x: number; y: number }) => {
  return {
    r1: (TEXTURE_SIZE * 0.7 * ratios.x) / 2 + getDEWWidth(DEW),
    r2: (TEXTURE_SIZE * 0.7 * ratios.y) / 2 + getDEWWidth(DEW),
  };
};

const getCCEWRadiuses = (
  DEW: number,
  evasion: number,
  CCEW: number,
  ratios: { x: number; y: number }
) => {
  const { r1, r2 } = getDEWRadiuses(DEW, ratios);

  return {
    r1:
      r1 +
      getDEWWidth(DEW) / 2 +
      15 +
      getEvasionWidth(evasion) / 2 +
      15 +
      getCCEWWidth(CCEW) / 2,
    r2:
      r2 +
      getDEWWidth(DEW) / 2 +
      15 +
      getEvasionWidth(evasion) / 2 +
      15 +
      getCCEWWidth(CCEW) / 2,
  };
};

const getEvasionRadiuses = (
  DEW: number,
  evasion: number,
  ratios: { x: number; y: number }
) => {
  const { r1, r2 } = getDEWRadiuses(DEW, ratios);

  return {
    r1: r1 + getDEWWidth(DEW) / 2 + 15 + getEvasionWidth(evasion) / 2,
    r2: r2 + getDEWWidth(DEW) / 2 + 15 + getEvasionWidth(evasion) / 2,
  };
};

const drawEvasion = (
  context: CanvasRenderingContext2D,
  DEW: number,
  evasion: number,
  ratios: { x: number; y: number }
) => {
  if (!evasion) {
    return;
  }

  /*
  var a = 0.7;

  if (evasion < 3) {
    a = 0.9;
  }
*/

  context.strokeStyle = "rgba(20,140,128, 0.9)";
  context.lineWidth = getEvasionWidth(evasion);
  context.setLineDash([15, 5]);

  const { r1, r2 } = getEvasionRadiuses(DEW, evasion, ratios);
  drawFilledEllipse(context, TEXTURE_SIZE / 2, TEXTURE_SIZE / 2, r1, r2);

  context.setLineDash([]);
};

const drawCCEW = (
  context: CanvasRenderingContext2D,
  DEW: number,
  evasion: number,
  CCEW: number,
  ratios: { x: number; y: number }
) => {
  if (!CCEW) {
    return;
  }

  /*
  var a = 0.7;

  if (CCEW < 3) {
    a = 0.9;
  }
    */

  context.strokeStyle = "rgba(20,80,128, 0.9)";
  context.lineWidth = getCCEWWidth(CCEW);
  context.setLineDash([15, 5]);

  const { r1, r2 } = getCCEWRadiuses(DEW, evasion, CCEW, ratios);
  drawFilledEllipse(context, TEXTURE_SIZE / 2, TEXTURE_SIZE / 2, r1, r2);

  context.setLineDash([]);
};

class ShipEWSprite extends Sprite {
  private DEW: number;
  private CCEW: number;
  private evasion: number;
  private dimensions: { x: number; y: number };

  constructor(
    size: { width: number; height: number },
    z: number,
    dimensions: { x: number; y: number }
  ) {
    super(null, size, z);
    this.DEW = 0;
    this.CCEW = 0;
    this.evasion = 0;
    this.dimensions = dimensions;
  }

  calculateRadiusRatios() {
    const max =
      this.dimensions.x > this.dimensions.y
        ? this.dimensions.x
        : this.dimensions.y;

    const ratios = {
      x: this.dimensions.x / max,
      y: this.dimensions.y / max,
    };

    return ratios;
  }

  update(DEW: number, CCEW: number, evasion: number) {
    if (this.DEW === DEW && this.CCEW === CCEW && this.evasion === evasion) {
      return;
    }

    this.DEW = DEW;
    this.CCEW = CCEW;
    this.evasion = evasion;

    const canvas = abstractCanvas.create(TEXTURE_SIZE, TEXTURE_SIZE);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawDEW(context, DEW, this.calculateRadiusRatios());
    drawEvasion(context, DEW, evasion, this.calculateRadiusRatios());
    drawCCEW(context, DEW, evasion, CCEW, this.calculateRadiusRatios());

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    this.uniforms.texture.value = texture;
  }
}

export default ShipEWSprite;
