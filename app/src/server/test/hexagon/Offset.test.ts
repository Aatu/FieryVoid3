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

/*
test("Builds a larger neat ring", (test) => {
  const offset = new hexagon.Offset(0, 0);
  test.deepEqual(offset.ring(2), [
    new hexagon.Offset(-1, 2),
    new hexagon.Offset(0, 2),
    new hexagon.Offset(1, 2),
    new hexagon.Offset(2, 1),
    new hexagon.Offset(2, 0),
    new hexagon.Offset(2, -1),
    new hexagon.Offset(1, -2),
    new hexagon.Offset(0, -2),
    new hexagon.Offset(-1, -2),
    new hexagon.Offset(-1, -1),
    new hexagon.Offset(-2, 0),
    new hexagon.Offset(-1, 1),
  ]);
});

test("Builds a neat spiral", (test) => {
  const offset = new hexagon.Offset(0, 0);
  test.deepEqual(offset.spiral(2), [
    new hexagon.Offset(0, 0),
    new hexagon.Offset(0, 1),
    new hexagon.Offset(1, 1),
    new hexagon.Offset(1, 0),
    new hexagon.Offset(1, -1),
    new hexagon.Offset(0, -1),
    new hexagon.Offset(-1, 0),
    new hexagon.Offset(-1, 2),
    new hexagon.Offset(0, 2),
    new hexagon.Offset(1, 2),
    new hexagon.Offset(2, 1),
    new hexagon.Offset(2, 0),
    new hexagon.Offset(2, -1),
    new hexagon.Offset(1, -2),
    new hexagon.Offset(0, -2),
    new hexagon.Offset(-1, -2),
    new hexagon.Offset(-1, -1),
    new hexagon.Offset(-2, 0),
    new hexagon.Offset(-1, 1),
  ]);
});

test("Builds a neat offset spiral", (test) => {
  const offset = new hexagon.Offset(1, 1);
  test.deepEqual(offset.spiral(1), [
    new hexagon.Offset(1, 1),
    new hexagon.Offset(0, 2),
    new hexagon.Offset(1, 2),
    new hexagon.Offset(2, 1),
    new hexagon.Offset(1, 0),
    new hexagon.Offset(0, 0),
    new hexagon.Offset(0, 1),
  ]);
});

test("Move to direction", (test) => {
  const offset = new hexagon.Offset(1, 1);
  test.deepEqual(offset.moveToDirection(2, 2), new hexagon.Offset(0, -1));
});

test("Rotate hex", (test) => {
  let offset = new hexagon.Offset(1, 0);

  test.deepEqual(offset.rotate(1), new hexagon.Offset(1, -1));
  test.deepEqual(offset.rotate(2), new hexagon.Offset(0, -1));
  test.deepEqual(offset.rotate(3), new hexagon.Offset(-1, 0));
  test.deepEqual(offset.rotate(4), new hexagon.Offset(0, 1));
  test.deepEqual(offset.rotate(5), new hexagon.Offset(1, 1));

  offset = new hexagon.Offset(2, 0);

  test.deepEqual(offset.rotate(1), new hexagon.Offset(1, -2));
  test.deepEqual(offset.rotate(2), new hexagon.Offset(-1, -2));
  test.deepEqual(offset.rotate(3), new hexagon.Offset(-2, 0));
  test.deepEqual(offset.rotate(4), new hexagon.Offset(-1, 2));
  test.deepEqual(offset.rotate(5), new hexagon.Offset(1, 2));
});

test("Normalize hex", (test) => {
  test.deepEqual(
    new hexagon.Offset(5, 0).normalize(),
    new hexagon.Offset(1, 0)
  );

  test.deepEqual(
    new hexagon.Offset(-3, 6).normalize(),
    new hexagon.Offset(0, 1)
  );
});
*/
