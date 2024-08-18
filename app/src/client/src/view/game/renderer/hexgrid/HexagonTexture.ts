import * as THREE from "three";
import { drawCenteredHexagon } from "../../utils/graphics";
import abstractCanvas from "../../utils/abstractCanvas";
import HexagonMath from "@fieryvoid3/model/src/utils/HexagonMath";

const createCanvas = (width: number, height: number, debug?: boolean) => {
  return abstractCanvas.create(width, height, debug);
};

const getTexture = function (
  canvas: HTMLCanvasElement,
  gridWidth: number,
  gridHeight: number
) {
  if (gridWidth === undefined) {
    gridWidth = 1;
  }

  if (gridHeight === undefined) {
    gridHeight = 1;
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    getHorizontalRepeat(gridWidth),
    getVerticalRepeat(gridHeight)
  );

  texture.offset.set(0, 0.16666);

  return texture;
};

const getHorizontalRepeat = (hexagons: number) =>
  3 / 4 + ((hexagons - 1) * 2) / 4;

const getVerticalRepeat = (hexagons: number) =>
  4 / 6 + ((hexagons - 1) * 3) / 6;

const renderHexGrid = (
  canvasSize: number,
  lineColor: string,
  fillColor: string,
  lineWidth: number,
  repeat: boolean = false
) => {
  const scale = { x: 1, y: 1 };
  const width = canvasSize;
  const hl = width / 4 / Math.cos((30 / 180) * Math.PI);
  const a = HexagonMath.getHexA(hl);
  const b = HexagonMath.getHexB(hl);
  const x = b;

  const height = HexagonMath.getTextureHeight(hl);

  const canvas = createCanvas(width, height, false);
  const context = canvas.getContext("2d", {
    antialias: true,
  }) as CanvasRenderingContext2D;
  context.fillStyle = lineColor;
  context.strokeStyle = lineColor;
  context.fillStyle = fillColor;
  context.lineWidth = lineWidth;

  context.scale(scale.x, scale.y);

  if (repeat) {
    drawCenteredHexagon(context, x, 0, hl, true, true, true);
    drawCenteredHexagon(context, x * 3, 0, hl, true, true, true);
  }

  drawCenteredHexagon(context, x * 2, hl + a, hl, true, true, true);

  if (repeat) {
    drawCenteredHexagon(context, x, hl * 3, hl, true, true, true);
    drawCenteredHexagon(context, x * 3, hl * 3, hl, true, true, true);
  }

  const canvas2 = createCanvas(width, width, false);

  (
    canvas2.getContext("2d", { antialias: true }) as CanvasRenderingContext2D
  )?.drawImage(canvas, 0, 0, width, height, 0, 0, width, width);

  return canvas2;
};

const getHexGridTexture = (
  canvasSize: number,
  gridWidth: number,
  gridHeight: number,
  lineColor: string,
  fillColor: string,
  lineWidth: number
) => {
  return getTexture(
    renderHexGrid(canvasSize, lineColor, fillColor, lineWidth, true),
    gridWidth,
    gridHeight
  );
};

const getHexTexture = (
  canvasSize: number,
  lineColor: string,
  fillColor: string,
  lineWidth: number
) => {
  return getTexture(
    renderHexGrid(canvasSize, lineColor, fillColor, lineWidth),
    1,
    1
  );
};

export default {
  renderHexGrid,
  getHexGridTexture,
  getHexTexture,
};
