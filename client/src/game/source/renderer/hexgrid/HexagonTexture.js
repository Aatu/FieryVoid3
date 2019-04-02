"use strict";

import { drawCenteredHexagon } from "../../utils/graphics";
import abstractCanvas from "../../utils/abstractCanvas";

const createCanvas = (width, height, debug) => {
  return abstractCanvas.create(width, height, debug);
};

const getTexture = function(canvas, gridWidth, gridHeight) {
  if (gridWidth == undefined) {
    gridWidth = 1;
  }

  if (gridHeight == undefined) {
    gridHeight = 1;
  }

  var texture = new THREE.Texture(canvas);
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

const getHorizontalRepeat = hexagons => 3 / 4 + ((hexagons - 1) * 2) / 4;

const getVerticalRepeat = hexagons => 4 / 6 + ((hexagons - 1) * 3) / 6;

const renderHexGrid = (canvasSize, lineColor, fillColor, lineWidth, repeat) => {
  var scale = { x: 1, y: 1 };
  var width = canvasSize;
  var hl = width / 4 / Math.cos((30 / 180) * Math.PI);
  var a = window.HexagonMath.getHexA(hl);
  var b = window.HexagonMath.getHexB(hl);
  var x = b;

  var height = window.HexagonMath.getTextureHeight(hl);

  var canvas = createCanvas(width, height, false);
  var context = canvas.getContext("2d", { antialias: true });
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

  var canvas2 = createCanvas(width, width, false);

  canvas2
    .getContext("2d", { antialias: true })
    .drawImage(canvas, 0, 0, width, height, 0, 0, width, width);

  return canvas2;
};

const getHexGridTexture = (
  canvasSize,
  gridWidth,
  gridHeight,
  lineColor,
  fillColor,
  lineWidth
) => {
  return getTexture(
    renderHexGrid(canvasSize, lineColor, fillColor, lineWidth, true),
    gridWidth,
    gridHeight
  );
};

const getHexTexture = (canvasSize, lineColor, fillColor, lineWidth) => {
  return getTexture(
    renderHexGrid(canvasSize, lineColor, fillColor, lineWidth),
    1,
    1
  );
};

export default {
  getHexGridTexture,
  getHexTexture
};
