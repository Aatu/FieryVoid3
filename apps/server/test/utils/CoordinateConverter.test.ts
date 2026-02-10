import { expect, test } from "vitest";
import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { Offset } from "@fieryvoid3/model/src/hexagon/index";
import HexagonMath from "@fieryvoid3/model/src/utils/HexagonMath";

test("hex size and coordinate converter", (test) => {
  const a = coordinateConverter.fromHexToGame(new Offset(0, 0));
  const b = coordinateConverter.fromHexToGame(new Offset(1, 0));

  expect(Math.round(a.distanceTo(b))).toEqual(
    Math.round(HexagonMath.getHexWidth())
  );
});
