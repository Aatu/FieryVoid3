import test from "ava";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import { OutputReduced6 } from "../../model/unit/system/criticals";

test("Engine generates thrust", test => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  test.deepEqual(engine.callHandler("getThrustOutput"), 12);
});

test("Destroyed engine does not generate thrust", test => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addDamage(new DamageEntry(50));
  test.deepEqual(engine.callHandler("getThrustOutput"), 0);
});

test("Engine with -6 critical will generate 6 less thrust", test => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 20, 6, 2);
  engine.addCritical(new OutputReduced6());
  test.deepEqual(engine.callHandler("getThrustOutput"), 14);
});

test("Engine that is offline will generate no thrust", test => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 20, 6, 2);
  engine.power.setOffline();
  test.true(engine.isDisabled());
  test.deepEqual(engine.callHandler("getThrustOutput"), 0);
  engine.power.setOnline();
  test.deepEqual(engine.callHandler("getThrustOutput"), 20);
});
