import test from "ava";
import coordinateConverter from "../../model/utils/CoordinateConverter";
import Offset from "../../model/hexagon/Offset";
import HexagonMath from "../../model/utils/HexagonMath";

test("hex size and coordinate converter", (test) => {
  const a = coordinateConverter.fromHexToGame(new Offset(0, 0));
  const b = coordinateConverter.fromHexToGame(new Offset(1, 0));

  test.is(Math.round(a.distanceTo(b)), Math.round(HexagonMath.getHexWidth()));
});
