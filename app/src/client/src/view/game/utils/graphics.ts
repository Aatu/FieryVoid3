import { WeaponArc } from "@fieryvoid3/model/src/unit/system/strategy/weapon/WeaponArcStrategy";
import * as mathlib from "@fieryvoid3/model/src/utils/math";
type Point = {
  x: number;
  y: number;
};

const clearCanvas = (canvasid: string) => {
  const canvas = document.getElementById(canvasid) as HTMLCanvasElement;

  if (!canvas) {
    throw new Error("Canvas is null");
  }

  canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
};

const clearContext = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const clearSmallCanvas = (context: CanvasRenderingContext2D) => {
  context.clearRect(0, 0, 100, 100);
};

const getCanvas = (canvasid: string): CanvasRenderingContext2D => {
  //console.log(canvasid);
  const canvas = document.getElementById(canvasid) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas is null");
  }

  return canvas.getContext("2d") as CanvasRenderingContext2D;
};

const drawCone = (
  canvas: CanvasRenderingContext2D,
  start: Point,
  p1: Point,
  p2: Point,
  arcs: WeaponArc,
  w: number
) => {
  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.moveTo(start.x, start.y);
  canvas.lineTo(p1.x, p1.y);
  canvas.arc(
    start.x,
    start.y,
    mathlib.distance({ ...start, z: 0 }, { ...p1, z: 0 }),
    mathlib.degreeToRadian(arcs.start),
    mathlib.degreeToRadian(arcs.end),
    false
  );
  //canvas.lineTo(start.x,start.y);
  canvas.closePath();
  canvas.stroke();
  canvas.fill();
};

const drawBox = (
  canvas: CanvasRenderingContext2D,
  p: Point,
  w: number,
  h: number,
  lw: number
) => {
  canvas.lineWidth = lw;
  canvas.beginPath();
  canvas.moveTo(p.x - w / 2, p.y + h / 2);
  canvas.lineTo(p.x + w / 2, p.y + h / 2);
  canvas.lineTo(p.x + w / 2, p.y - h / 2);
  canvas.lineTo(p.x - w / 2, p.y - h / 2);
  canvas.closePath();
  canvas.stroke();
  canvas.fill();
};

const drawCircle = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  w: number
) => {
  if (r < 1) r = 1;
  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.arc(x, y, r, 0, Math.PI * 2, true);
  canvas.closePath();
  canvas.stroke();
};

const drawHollowCircleAndFill = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  r2: number
) => {
  canvas.beginPath();
  canvas.arc(x, y, r2, 0, Math.PI * 2, false); // outer (filled)
  canvas.moveTo(x + r, y);
  canvas.arc(x, y, r, 0, Math.PI * 2, true); // inner (unfills it)
  canvas.stroke();
  canvas.fill();
};

const drawEllipseSegment = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  s: number,
  e: number
) => {
  canvas.beginPath();
  //.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
  canvas.ellipse(x, y, rx, ry, 0, s, e, false);

  canvas.closePath();
  canvas.stroke();
};

const drawCircleSegment = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  r2: number,
  s: number,
  e: number
) => {
  canvas.beginPath();
  canvas.arc(x, y, r2, s, e, false); // outer (filled)

  const p1 = mathlib.getPointInDirection(r, -mathlib.radianToDegree(e), x, y);
  canvas.lineTo(p1.x, p1.y);
  canvas.arc(x, y, r, e, s, true); // inner (unfills it)
  const p2 = mathlib.getPointInDirection(r2, -mathlib.radianToDegree(s), x, y);
  canvas.lineTo(p2.x, p2.y);

  canvas.closePath();
  canvas.stroke();
  canvas.fill();
};

const drawDottedCircle = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  r2: number,
  segments: number,
  gapratio: number
) => {
  const deg = 360 / segments;
  const gap = deg * gapratio;

  for (let d = 0; d < 360; d += deg) {
    drawCircleSegment(
      canvas,
      x,
      y,
      r,
      r2,
      mathlib.degreeToRadian(d),
      mathlib.degreeToRadian(d + deg - gap)
    );
  }
};

const drawFilledCircle = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r1: number,
  r2: number
) => {
  drawCircleSegment(
    canvas,
    x,
    y,
    r1,
    r2,
    mathlib.degreeToRadian(0),
    mathlib.degreeToRadian(360)
  );
};

const drawFilledEllipse = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r1: number,
  r2: number
) => {
  drawEllipseSegment(
    canvas,
    x,
    y,
    r1,
    r2,
    mathlib.degreeToRadian(0),
    mathlib.degreeToRadian(360)
  );
};

const drawCircleAndFill = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  w: number
) => {
  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.arc(x, y, r, 0, Math.PI * 2, true);
  canvas.closePath();
  canvas.stroke();
  canvas.fill();
};

const drawCircleNoStroke = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  w: number
) => {
  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.arc(x, y, r, 0, Math.PI * 2, true);
  canvas.closePath();
  canvas.fill();
};

const drawLine = (
  canvas: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number
) => {
  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.moveTo(x1, y1);
  canvas.lineTo(x2, y2);
  canvas.stroke();
};

const drawArrow = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  a: number,
  s: number,
  w: number
) => {
  const p1 = mathlib.getPointInDirection(s * 0.5, -a, x, y);
  const p2 = mathlib.getPointInDirection(
    s * 0.5,
    -mathlib.addToDirection(a, -140),
    p1.x,
    p1.y
  );
  const p3 = mathlib.getPointInDirection(
    s * 0.15,
    -mathlib.addToDirection(a, 90),
    p2.x,
    p2.y
  );
  const p4 = mathlib.getPointInDirection(
    s * 0.5,
    -mathlib.addToDirection(a, 180),
    p3.x,
    p3.y
  );

  const p7 = mathlib.getPointInDirection(
    s * 0.5,
    -mathlib.addToDirection(a, 140),
    p1.x,
    p1.y
  );
  const p6 = mathlib.getPointInDirection(
    s * 0.15,
    -mathlib.addToDirection(a, -90),
    p7.x,
    p7.y
  );
  const p5 = mathlib.getPointInDirection(
    s * 0.5,
    -mathlib.addToDirection(a, 180),
    p6.x,
    p6.y
  );

  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.moveTo(p1.x, p1.y);
  canvas.lineTo(p2.x, p2.y);
  canvas.lineTo(p3.x, p3.y);
  canvas.lineTo(p4.x, p4.y);
  canvas.lineTo(p5.x, p5.y);
  canvas.lineTo(p6.x, p6.y);
  canvas.lineTo(p7.x, p7.y);
  canvas.closePath();
  canvas.fill();
  canvas.stroke();
};

const drawX = (
  canvas: CanvasRenderingContext2D,
  x: number | string,
  y: number | string,
  l: number | string,
  w: number
) => {
  x = parseInt(x.toString());
  y = parseInt(y.toString());
  l = parseInt(l.toString());

  canvas.lineWidth = w;
  canvas.beginPath();
  canvas.moveTo(x - l, y - l);
  canvas.lineTo(x + l, y + l);
  canvas.stroke();

  canvas.beginPath();
  canvas.moveTo(x - l, y + l);
  canvas.lineTo(x + l, y - l);
  canvas.stroke();
};

const drawCenteredHexagon = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  l: number,
  leftside: boolean,
  topleft: boolean,
  topright: boolean
) => {
  const a = l * Math.sin((30 / 180) * Math.PI);
  const b = l * Math.cos((30 / 180) * Math.PI);

  x = x - b;
  y = y - a * 2;
  drawHexagon(canvas, x, y, l, leftside, topleft, topright);
};

const drawHexagon = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  l: number,
  leftside: boolean,
  topleft: boolean,
  topright: boolean
) => {
  const a = l * Math.sin((30 / 180) * Math.PI);
  const b = l * Math.cos((30 / 180) * Math.PI);

  const p1 = { x: x, y: y + a + l };
  const p2 = { x: x, y: y + a };
  const p3 = { x: x + b, y: y };
  const p4 = { x: x + 2 * b, y: y + a };
  const p5 = { x: x + 2 * b, y: y + a + l };
  const p6 = { x: x + b, y: y + 2 * l };

  canvas.beginPath();

  if (leftside) {
    canvas.moveTo(p1.x, p1.y);
    canvas.lineTo(p2.x, p2.y);
  } else {
    canvas.moveTo(p2.x, p2.y);
  }

  if (topleft) {
    canvas.lineTo(p3.x, p3.y);
  } else {
    canvas.moveTo(p3.x, p3.y);
  }

  if (topright) {
    canvas.lineTo(p4.x, p4.y);
  } else {
    canvas.moveTo(p4.x, p4.y);
  }

  canvas.lineTo(p5.x, p5.y);
  canvas.lineTo(p6.x, p6.y);
  canvas.lineTo(p1.x, p1.y);
  canvas.closePath();

  canvas.stroke();
  canvas.fill();
};

const drawAndRotate = (
  canvas: CanvasRenderingContext2D,
  w: number,
  h: number,
  iw: number,
  ih: number,
  angle: number,
  img: CanvasImageSource,
  rolled: boolean
) => {
  const x = Math.round(w / 2);
  const y = Math.round(h / 2);
  const width = iw / 2;
  const height = ih / 2;

  if (rolled) angle = 360 - angle;

  angle = (angle * Math.PI) / 180;
  canvas.save();
  canvas.translate(x, y);
  if (rolled) canvas.scale(1, -1);
  canvas.rotate(angle);
  canvas.drawImage(img, -width / 2, -height / 2, width, height);
  canvas.rotate(-angle);
  canvas.translate(-x, -y);
  canvas.restore();
};

export {
  clearCanvas,
  clearContext,
  clearSmallCanvas,
  getCanvas,
  drawCone,
  drawBox,
  drawCircle,
  drawHollowCircleAndFill,
  drawDottedCircle,
  drawCircleSegment,
  drawCircleAndFill,
  drawFilledCircle,
  drawCircleNoStroke,
  drawLine,
  drawArrow,
  drawX,
  drawCenteredHexagon,
  drawHexagon,
  drawAndRotate,
  drawFilledEllipse,
};
