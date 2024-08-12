import { expect, test } from "vitest";
import Ship from "../../../model/src/unit/Ship";
import Thruster from "../../../model/src/unit/system/thruster/Thruster";
import Engine from "../../../model/src/unit/system/engine/Engine";
import Reactor from "../../../model/src/unit/system/reactor/Reactor";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";

const constructShip = (id: string = "123") => {
  let ship = new Ship({
    id,
  });

  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ]);

  return ship;
};

test("Ship systems serializes and deserializes nicely", (test) => {
  let ship = constructShip("73");

  ship.systems.getSystemById(1).addDamage(new DamageEntry(3));
  ship.systems.getSystemById(3).addDamage(new DamageEntry(10));
  ship.systems.getSystemById(5).power.setOffline();

  const serialized = ship.serialize();

  let ship2 = constructShip().deserialize(serialized);
  expect(ship2.systems.getSystemById(1).getTotalDamage()).toBe(3);
  expect(ship2.systems.getSystemById(3).isDestroyed()).toBe(true);
  expect(ship2.systems.getSystemById(5) instanceof Engine).toBe(true);
  expect(ship2.systems.getSystemById(5).power.isOffline()).toBe(true);
});
