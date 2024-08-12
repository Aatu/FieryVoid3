import { expect, test } from "vitest";
import Engine from "../../../model/src/unit/system/engine/Engine";
import OutputReduced6 from "../../../model/src/unit/system/criticals/OutputReduced6";

test("System can be assigned an critical", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6());
  expect(engine.hasCritical(new OutputReduced6())).toBe(true);
  expect(engine.hasCritical(OutputReduced6)).toBe(true);
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
});

test("System critical with duration will go away", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6(2));
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(1);
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(2);
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(3);
  expect(engine.hasCritical("OutputReduced6")).toBe(false);
});

test("System critical serializes and deserializes nicely", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  engine.addCritical(new OutputReduced6(2));
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(1);
  engine.deserialize(engine.serialize());
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(2);
  expect(engine.hasCritical("OutputReduced6")).toBe(true);
  engine.advanceTurn(3);
  expect(engine.hasCritical("OutputReduced6"));
});
