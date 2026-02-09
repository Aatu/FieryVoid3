import { expect, test } from "vitest";
import TestShip from "../../../model/src/unit/ships/test/TestShip";
import OutputReduced8 from "../../../model/src/unit/system/criticals/OutputReduced8";
import OutputReduced6 from "../../../model/src/unit/system/criticals/OutputReduced6";

test("Ship resolves valid power", () => {
  let ship = new TestShip({ id: "123" });
  ship.systems.getSystemById(7).addCritical(new OutputReduced8());
  ship.systems.getSystemById(7).addCritical(new OutputReduced6());

  expect(ship.systems.power.isValidPower()).toBe(false);
  ship.systems.power.forceValidPower();
  expect(ship.systems.power.isValidPower()).toBe(true);
});
