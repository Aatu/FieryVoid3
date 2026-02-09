import { expect, test } from "vitest";
import Thruster from "../../../model/src/unit/system/thruster/Thruster";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";

test("Thruster can channel thrust", (test) => {
  const thruster = new Thruster({ id: 123, hitpoints: 10, armor: 3 }, 5, 0);
  expect(
    thruster.callHandler(
      SYSTEM_HANDLERS.getThrustOutput,
      undefined,
      0 as number
    )
  ).toEqual(5);
});

test("Destroyed thruster channels nothing", (test) => {
  const thruster = new Thruster({ id: 123, hitpoints: 10, armor: 3 }, 5, 0);
  thruster.addDamage(new DamageEntry(50));
  expect(
    thruster.callHandler(
      SYSTEM_HANDLERS.getThrustOutput,
      undefined,
      0 as number
    )
  ).toEqual(0);
});
