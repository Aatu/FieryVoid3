import test from "ava";
import { StandardRangeStrategy } from "../../model/unit/system/strategy/index.mjs";

test("Gets the correct range penalty from range strategy", test => {
  const rangeStrategy = new StandardRangeStrategy([
    { range: 0, modifier: 20 },
    { range: 5, modifier: 10 },
    { range: 10, modifier: -30 },
    { range: 20, modifier: -90 },
    { range: 30, modifier: -200 }
  ]);

  test.is(rangeStrategy.getRangeModifier({ distance: 0 }), 20);
  test.is(rangeStrategy.getRangeModifier({ distance: 30 }), -200);
  test.is(rangeStrategy.getRangeModifier({ distance: 31 }), -200);
  test.is(rangeStrategy.getRangeModifier({ distance: 3 }), 14);
  test.is(rangeStrategy.getRangeModifier({ distance: 23 }), -123);
});
