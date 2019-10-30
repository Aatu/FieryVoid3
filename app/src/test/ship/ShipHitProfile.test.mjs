import test from "ava";
import Ship from "../../model/unit/Ship.mjs";

test("Gets the correct hit profile", test => {
  const ship = new Ship({});
  ship.frontHitProfile = 30;
  ship.sideHitProfile = 50;
  let facing = 0;

  ship.getShootingPosition = () => ({ x: 0, y: 0 });
  ship.getShootingFacing = () => facing;

  test.is(ship.getHitProfile({ x: 200, y: 0 }), 30);

  facing = 4;
  test.is(ship.getHitProfile({ x: 200, y: 0 }), 50);

  facing = 3;
  test.is(ship.getHitProfile({ x: 200, y: 0 }), 30);
});
