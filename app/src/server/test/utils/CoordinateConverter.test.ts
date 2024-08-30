import { expect, test } from "vitest";
import coordinateConverter from "../../../model/src/utils/CoordinateConverter";
import { Offset } from "../../../model/src/hexagon";
import HexagonMath from "../../../model/src/utils/HexagonMath";

test("hex size and coordinate converter", (test) => {
  const a = coordinateConverter.fromHexToGame(new Offset(0, 0));
  const b = coordinateConverter.fromHexToGame(new Offset(1, 0));

  expect(Math.round(a.distanceTo(b))).toEqual(
    Math.round(HexagonMath.getHexWidth())
  );
});
