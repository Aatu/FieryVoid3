import { expect, test } from "vitest";
import WeaponArcStrategy from "../../../model/src/unit/system/strategy/weapon/WeaponArcStrategy";
import Vector from "../../../model/src/utils/Vector";
import Ship from "../../../model/src/unit/Ship";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";

test("Ship is on weapon arc", () => {
  const arcStrategy = new WeaponArcStrategy([{ start: 330, end: 30 }]);

  let shooterPosition = new Vector(0, 0);
  let shooterFacing = 0;
  let targetPosition = new Vector(200, 0);

  const shooter = {
    getPosition: () => shooterPosition,
    getFacing: () => shooterFacing,
    movement: {
      isRolled: () => false,
    },
    getSystem: () => weapon,
  } as unknown as Ship;

  const weapon = {
    getShipSystems: () => ({
      ship: shooter,
    }),
  } as unknown as ShipSystem;

  arcStrategy.init(weapon);

  const target = { getPosition: () => targetPosition } as unknown as Ship;

  expect(arcStrategy.isOnArc({ target })).toEqual(true);
  shooterFacing = 5;
  expect(arcStrategy.isOnArc({ target })).toEqual(false);
  targetPosition = new Vector(200, 200);
  expect(arcStrategy.isOnArc({ target })).toEqual(true);
});

test("When ship is rolled, weapon arcs are flipped", () => {
  const arcStrategy = new WeaponArcStrategy([{ start: 180, end: 0 }]);

  let shooterPosition = new Vector(0, 0);
  let shooterFacing = 0;
  let targetPosition = new Vector(0, -200);
  const shooter = {
    getPosition: () => shooterPosition,
    getFacing: () => shooterFacing,
    movement: {
      isRolled: () => true,
    },
    getSystem: () => weapon,
  } as unknown as Ship;

  const weapon = {
    getShipSystems: () => ({
      ship: shooter,
    }),
  } as unknown as ShipSystem;

  arcStrategy.init(weapon);

  const target = { getPosition: () => targetPosition } as unknown as Ship;

  expect(arcStrategy.isOnArc({ target })).toEqual(true);
  shooter.movement.isRolled = () => false;
  expect(arcStrategy.isOnArc({ target })).toEqual(false);
});
