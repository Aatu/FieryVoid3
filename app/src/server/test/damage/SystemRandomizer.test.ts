import { expect, test } from "vitest";
import HitSystemRandomizer from "../../../model/src/unit/system/strategy/weapon/utils/HitSystemRandomizer";
import { Reactor } from "../../../model/src/unit/system/reactor";
import { Structure } from "../../../model/src/unit/system/structure";
import { RailgunTurreted32gw } from "../../../model/src/unit/system/weapon/coilgun";
import { PDC30mm } from "../../../model/src/unit/system/weapon/pdc";

test("Chooses random system from available", () => {
  const systemRandomizer = new HitSystemRandomizer();
  let roll = 1;
  const systems = [
    new Structure({ id: 1, hitpoints: 50, armor: 5 }),
    new Reactor({ id: 2, hitpoints: 25, armor: 7 }, 10),
    new PDC30mm({ id: 3, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new RailgunTurreted32gw(
      { id: 4, hitpoints: 10, armor: 3 },
      { start: 0, end: 0 }
    ),
    new RailgunTurreted32gw(
      { id: 5, hitpoints: 10, armor: 3 },
      { start: 0, end: 0 }
    ),
  ];

  systemRandomizer["rollForSystem"] = (totalStructure) => {
    expect(totalStructure).toBe(99);
    return roll;
  };

  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(1);

  roll = 50;
  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(1);

  roll = 51;
  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(2);

  roll = 75;
  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(2);

  roll = 76;
  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(3);

  roll = 99;
  expect(systemRandomizer["randomizeHitSystem"](systems)?.id).toBe(5);
});
