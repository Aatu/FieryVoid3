import { expect, test } from "vitest";
import Ship from "../../../model/src/unit/Ship";
import Vector from "../../../model/src/utils/Vector";

test("Gets the correct hit profile", () => {
  const ship = new Ship({});
  ship.frontHitProfile = 30;
  ship.sideHitProfile = 50;
  let facing = 0;

  ship.getPosition = () => new Vector({ x: 0, y: 0, z: 0 });
  ship.getFacing = () => facing;

  expect(ship.getHitProfile({ x: 200, y: 0, z: 0 })).toBe(30);

  facing = 4;
  expect(ship.getHitProfile({ x: 200, y: 0, z: 0 })).toBe(50);

  facing = 3;
  expect(ship.getHitProfile({ x: 200, y: 0, z: 0 })).toBe(30);
});
