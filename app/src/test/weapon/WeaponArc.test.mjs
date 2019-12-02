import test from "ava";
import Vector from "../../model/utils/Vector.mjs";
import { WeaponArcStrategy } from "../../model/unit/system/strategy/index.mjs";

test("Ship is on weapon arc", test => {
  const arcStrategy = new WeaponArcStrategy([{ start: 330, end: 30 }]);

  let shooterPosition = new Vector(0, 0);
  let shooterFacing = 0;
  let targetPosition = new Vector(200, 0);
  const shooter = {
    getPosition: () => shooterPosition,
    getFacing: () => shooterFacing
  };

  arcStrategy.system = {
    shipSystems: {
      ship: shooter
    }
  };

  const target = { getPosition: () => targetPosition };

  test.true(arcStrategy.isOnArc({ target }));
  shooterFacing = 5;
  test.false(arcStrategy.isOnArc({ target }));
  targetPosition = new Vector(200, 200);
  test.true(arcStrategy.isOnArc({ target }));
});
