import test from "ava";
import hexagon from "../../model/hexagon";

test("Builds a neat ring", test => {
  const offset = new hexagon.Offset(0, 0);
  test.deepEqual(offset.ring(1), [
    new hexagon.Offset(0, 1),
    new hexagon.Offset(1, 1),
    new hexagon.Offset(1, 0),
    new hexagon.Offset(1, -1),
    new hexagon.Offset(0, -1),
    new hexagon.Offset(-1, 0)
  ]);
});

test("Builds a larger neat ring", test => {
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
    new hexagon.Offset(-1, 1)
  ]);
});

test("Builds a neat spiral", test => {
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
    new hexagon.Offset(-1, 1)
  ]);
});

test("Builds a neat offset spiral", test => {
  const offset = new hexagon.Offset(1, 1);
  test.deepEqual(offset.spiral(1), [
    new hexagon.Offset(1, 1),
    new hexagon.Offset(0, 2),
    new hexagon.Offset(1, 2),
    new hexagon.Offset(2, 1),
    new hexagon.Offset(1, 0),
    new hexagon.Offset(0, 0),
    new hexagon.Offset(0, 1)
  ]);
});

test("Move to direction", test => {
  const offset = new hexagon.Offset(1, 1);
  test.deepEqual(offset.moveToDirection(2, 2), new hexagon.Offset(0, -1));
});