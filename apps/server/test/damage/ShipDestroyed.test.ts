import { expect, test } from "vitest";
import Ship from "../../../model/src/unit/Ship";
import Structure from "../../../model/src/unit/system/structure/Structure";
import Engine from "../../../model/src/unit/system/engine/Engine";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { Reactor } from "../../../model/src/unit/system/reactor";
import { PDC30mm } from "../../../model/src/unit/system/weapon/pdc";

const constructShip = (id: string = "123") => {
  let ship = new Ship({
    id,
  });

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  return ship;
};

test("Ship is not destroyed, because it is intact", () => {
  const ship = constructShip();

  expect(ship.isDestroyed()).toBe(false);
});

test("Ship is not destroyed, because its primary structure is not", () => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(500).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(300).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  expect(ship.isDestroyed()).toBe(false);
});

test("Ship is not destroyed, because not enough structures are", () => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0));
  expect(ship.isDestroyed()).toBe(false);
  expect(ship.isDestroyedThisTurn()).toBe(false);
});

test("Ship is barely destroyed", () => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  expect(ship.isDestroyed()).toBe(true);
  expect(ship.isDestroyedThisTurn()).toBe(true);
});

test("Ship is destroyed!", () => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(500).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(300).addDamage(new DamageEntry(400, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  expect(ship.isDestroyed()).toBe(true);
});
