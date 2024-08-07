import test from "ava";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/coilgun/index.mjs";

test("Chooses random system from available", test => {
  const systemRandomizer = new HitSystemRandomizer();
  let roll = 1;
  const systems = [
    new Structure({ id: 1, hitpoints: 50, armor: 5 }),
    new Reactor({ id: 2, hitpoints: 25, armor: 7 }),
    new PDC30mm({ id: 3, hitpoints: 5, armor: 3 }),
    new RailgunTurreted32gw({ id: 4, hitpoints: 10, armor: 3 }),
    new RailgunTurreted32gw({ id: 5, hitpoints: 10, armor: 3 })
  ];

  systemRandomizer.rollForSystem = totalStructure => {
    test.is(totalStructure, 99);
    return roll;
  };

  test.is(systemRandomizer.randomizeHitSystem(systems).id, 1);

  roll = 50;
  test.is(systemRandomizer.randomizeHitSystem(systems).id, 1);

  roll = 51;
  test.is(systemRandomizer.randomizeHitSystem(systems).id, 2);

  roll = 75;
  test.is(systemRandomizer.randomizeHitSystem(systems).id, 2);

  roll = 76;
  test.is(systemRandomizer.randomizeHitSystem(systems).id, 3);

  roll = 99;
  test.is(systemRandomizer.randomizeHitSystem(systems).id, 5);
});
