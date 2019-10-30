import test from "ava";
import Vector from "../../model/utils/Vector.mjs";
import { WeaponArcStrategy } from "../../model/unit/system/strategy/index.mjs";

test("Ship is on weapon arc", test => {
  const arcStrategy = new WeaponArcStrategy([{ start: 330, end: 30 }]);

  let shooterPosition = new Vector(0, 0);
  let shooterFacing = 0;
  let targetPosition = new Vector(200, 0);
  const shooter = {
    getShootingPosition: () => shooterPosition,
    getShootingFacing: () => shooterFacing
  };
  const target = { getShootingPosition: () => targetPosition };

  test.true(arcStrategy.isOnArc({ shooter, target }));
  shooterFacing = 5;
  test.false(arcStrategy.isOnArc({ shooter, target }));
  targetPosition = new Vector(200, 200);
  test.true(arcStrategy.isOnArc({ shooter, target }));
});
