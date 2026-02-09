import { expect, test } from "vitest";
import Engine from "../../../model/src/unit/system/engine/Engine";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import OutputReduced6 from "../../../model/src/unit/system/criticals/OutputReduced6";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

test("Engine generates thrust", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(12);
});

test("Destroyed engine does not generate thrust", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addDamage(new DamageEntry(50));
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(0);
});

test("Engine with -6 critical will generate 6 less thrust", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 20, 6, 2);
  engine.addCritical(new OutputReduced6());
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(14);
});

test("Engine that is offline will generate no thrust", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 20, 6, 2);
  engine.power.setOffline();
  expect(engine.isDisabled()).toBe(true);
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(0);
  engine.power.setOnline();
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(20);
});
