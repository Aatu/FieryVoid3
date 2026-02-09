import { expect, test } from "vitest";
import Offset from "../../../model/src/hexagon/Offset";

test("Builds a neat ring", () => {
  const offset = new Offset(0, 0);
  expect(offset.ring(1)).toEqual([
    new Offset(0, 1),
    new Offset(1, 1),
    new Offset(1, 0),
    new Offset(1, -1),
    new Offset(0, -1),
    new Offset(-1, 0),
  ]);
});

test("Builds a larger neat ring", () => {
  const offset = new Offset(0, 0);
  expect(offset.ring(2)).toEqual([
    new Offset(-1, 2),
    new Offset(0, 2),
    new Offset(1, 2),
    new Offset(2, 1),
    new Offset(2, 0),
    new Offset(2, -1),
    new Offset(1, -2),
    new Offset(0, -2),
    new Offset(-1, -2),
    new Offset(-1, -1),
    new Offset(-2, 0),
    new Offset(-1, 1),
  ]);
});

test("Builds a neat spiral", () => {
  const offset = new Offset(0, 0);
  expect(offset.spiral(2)).toEqual([
    new Offset(0, 0),
    new Offset(0, 1),
    new Offset(1, 1),
    new Offset(1, 0),
    new Offset(1, -1),
    new Offset(0, -1),
    new Offset(-1, 0),
    new Offset(-1, 2),
    new Offset(0, 2),
    new Offset(1, 2),
    new Offset(2, 1),
    new Offset(2, 0),
    new Offset(2, -1),
    new Offset(1, -2),
    new Offset(0, -2),
    new Offset(-1, -2),
    new Offset(-1, -1),
    new Offset(-2, 0),
    new Offset(-1, 1),
  ]);
});

test("Builds a neat offset spiral", () => {
  const offset = new Offset(1, 1);

  expect(offset.spiral(1)).toEqual([
    new Offset(1, 1),
    new Offset(0, 2),
    new Offset(1, 2),
    new Offset(2, 1),
    new Offset(1, 0),
    new Offset(0, 0),
    new Offset(0, 1),
  ]);
});

test("Move to direction", () => {
  const offset = new Offset(1, 1);

  expect(offset.moveToDirection(2, 2)).toEqual(new Offset(0, -1));
});

test("Rotate hex", () => {
  let offset = new Offset(1, 0);

  expect(offset.rotate(1)).toEqual(new Offset(1, -1));
  expect(offset.rotate(2)).toEqual(new Offset(0, -1));
  expect(offset.rotate(3)).toEqual(new Offset(-1, 0));
  expect(offset.rotate(4)).toEqual(new Offset(0, 1));
  expect(offset.rotate(5)).toEqual(new Offset(1, 1));

  offset = new Offset(2, 0);

  expect(offset.rotate(1)).toEqual(new Offset(1, -2));
  expect(offset.rotate(2)).toEqual(new Offset(-1, -2));
  expect(offset.rotate(3)).toEqual(new Offset(-2, 0));
  expect(offset.rotate(4)).toEqual(new Offset(-1, 2));
  expect(offset.rotate(5)).toEqual(new Offset(1, 2));
});

test("Normalize hex", (test) => {
  expect(new Offset(5, 0).normalize()).toEqual(new Offset(1, 0));
  expect(new Offset(-3, 6).normalize()).toEqual(new Offset(0, 1));
});
