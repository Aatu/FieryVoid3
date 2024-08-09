import test from "ava";
import Engine from "../../model/unit/system/engine/Engine";
import DamageEntry from "../../model/unit/system/DamageEntry";
import { OutputReduced6 } from "../../model/unit/system/criticals";

test("System can be assigned an critical", (test) => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6());
  test.true(engine.hasCritical(new OutputReduced6()));
  test.true(engine.hasCritical(OutputReduced6));
  test.true(engine.hasCritical("OutputReduced6"));
});

test("System critical with duration will go away", (test) => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6(2));
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  test.false(engine.hasCritical("OutputReduced6"));
});

test("System critical serializes and deserializes nicely", (test) => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6(2));
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  engine.deserialize(engine.serialize());
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  test.true(engine.hasCritical("OutputReduced6"));
  engine.advanceTurn();
  test.false(engine.hasCritical("OutputReduced6"));
});
