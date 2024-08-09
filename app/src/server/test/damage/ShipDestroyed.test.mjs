import test from "ava";
import Reactor from "../../model/unit/system/reactor/Reactor";
import Structure from "../../model/unit/system/structure/Structure";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index";
import Ship from "../../model/unit/Ship";
import Engine from "../../model/unit/system/engine/Engine";
import DamageEntry from "../../model/unit/system/DamageEntry";

const constructShip = (id = 123) => {
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
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  return ship;
};

test("Ship is not destroyed, because it is intact", (test) => {
  const ship = constructShip();

  test.false(ship.isDestroyed());
});

test("Ship is not destroyed, because its primary structure is not", (test) => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(500).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(300).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  test.false(ship.isDestroyed());
});

test("Ship is not destroyed, because not enough structures are", (test) => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0, 0));
  test.false(ship.isDestroyed());
  test.false(ship.isDestroyedThisTurn());
});

test("Ship is barely destroyed", (test) => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  test.true(ship.isDestroyed());
  test.true(ship.isDestroyedThisTurn());
});

test("Ship is destroyed!", (test) => {
  const ship = constructShip();

  ship.systems.getSystemById(100).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(8).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(500).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(300).addDamage(new DamageEntry(400, 0, 0));
  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  test.true(ship.isDestroyed());
});
