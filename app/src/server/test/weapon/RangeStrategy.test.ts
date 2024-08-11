import { expect, test } from "vitest";
import StandardRangeStrategy from "../../../model/src/unit/system/strategy/weapon/StandardRangeStrategy";

test("Gets the correct range penalty from range strategy", () => {
  const rangeStrategy = new StandardRangeStrategy([
    { range: 0, modifier: 20 },
    { range: 5, modifier: 10 },
    { range: 10, modifier: -30 },
    { range: 20, modifier: -90 },
    { range: 30, modifier: -200 },
  ]);

  expect(rangeStrategy.getRangeModifier({ distance: 0 })).toEqual(20);
  expect(rangeStrategy.getRangeModifier({ distance: 30 })).toEqual(-200);
  expect(rangeStrategy.getRangeModifier({ distance: 31 })).toEqual(-200);
  expect(rangeStrategy.getRangeModifier({ distance: 3 })).toEqual(14);
  expect(rangeStrategy.getRangeModifier({ distance: 23 })).toEqual(-123);
});
