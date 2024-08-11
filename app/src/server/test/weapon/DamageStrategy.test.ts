import { expect, expectTypeOf, test } from "vitest";
import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import Structure from "../../../model/src/unit/system/structure/Structure";
import Engine from "../../../model/src/unit/system/engine/Engine";
import Reactor from "../../../model/src/unit/system/reactor/Reactor";
import PDC30mm from "../../../model/src/unit/system/weapon/pdc/PDC30mm";
import { MOVEMENT_TYPE, MovementOrder } from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import StandardDamageStrategy from "../../../model/src/unit/system/strategy/weapon/StandardDamageStrategy";
import HitSystemRandomizer from "../../../model/src/unit/system/strategy/weapon/utils/HitSystemRandomizer";
import FireOrder from "../../../model/src/weapon/FireOrder";
import CombatLogWeaponFireHitResult from "../../../model/src/combatLog/CombatLogWeaponFireHitResult";
import WeaponHitChance from "../../../model/src/weapon/WeaponHitChance";
import CombatLogWeaponFire from "../../../model/src/combatLog/CombatLogWeaponFire";
import PiercingDamageStrategy from "../../../model/src/unit/system/strategy/weapon/PiercingDamageStrategy";
import BurstDamageStrategy from "../../../model/src/unit/system/strategy/weapon/BurstDamageStrategy";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import ExplosiveDamageStrategy from "../../../model/src/unit/system/strategy/weapon/ExplosiveDamageStrategy";
import HETorpedoDamageStrategy from "../../../model/src/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/HETorpedoDamageStrategy";
import TorpedoFlight from "../../../model/src/unit/TorpedoFlight";
import Torpedo72HE from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo72HE";
import Vector from "../../../model/src/utils/Vector";
import CombatLogTorpedoAttack from "../../../model/src/combatLog/CombatLogTorpedoAttack";

const constructShip = (id: string = "123") => {
  let ship = new Ship({
    id,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);

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

test("Standard damage strategy overkills all the way trough", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  const damageStrategy = new StandardDamageStrategy(400, 10);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: (systems) => systems[0],
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    fireOrder: new FireOrder("-1", "1", "2", 3),
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChance({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter((system) => system.isDestroyed())
    .map((system) => system.id);

  expect(destroyedIds.sort()).toEqual([6, 8, 400, 100].sort());
});

test("Piercing damage strategy will damage multiple systems", (test) => {
  const ship = new Ship({
    id: 999,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201 }, { start: 0, end: 0 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  const damageStrategy = new PiercingDamageStrategy(1, 400);

  let i = 0;
  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: (systems) => {
      if (i > systems.length - 1) {
        i = 0;
      }

      const system = systems[i];
      i++;

      return system;
    },
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChance({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    fireOrder: new FireOrder("-1", "1", "2", 3),
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter((system) => system.getTotalDamage() > 0)
    .map((system) => system.id);

  expect(destroyedIds.sort()).toEqual([400, 500, 501, 6, 7, 8].sort());
});

test("Piercing damage strategy will stop when armor piercing runs out", (test) => {
  const ship = new Ship({
    id: 999,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201 }, { start: 0, end: 0 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  const damageStrategy = new PiercingDamageStrategy(1, 3);

  let i = 0;
  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: (systems) => {
      if (i > systems.length - 1) {
        i = 0;
      }

      const system = systems[i];
      i++;

      return system;
    },
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChance({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    fireOrder: new FireOrder("-1", "1", "2", 3),
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter((system) => system.getTotalDamage() > 0)
    .map((system) => system.id);

  expect(destroyedIds.sort()).toEqual([400, 501].sort());
});

test("Damage strategy returns reasonable damage numbers", (test) => {
  expect(new StandardDamageStrategy(10)["getDamageForWeaponHit"]()).toEqual(10);

  expectTypeOf(
    new StandardDamageStrategy("2d4 + 10")["getDamageForWeaponHit"]()
  ).toBeNumber();

  expectTypeOf(
    new StandardDamageStrategy("2d4+10")["getDamageForWeaponHit"]()
  ).toBeNumber();
});

test("Burst damage strategy amount of shots works", (test) => {
  expect(
    new BurstDamageStrategy(10, 0, 1, 6, 10)["getNumberOfShots"]({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChance({ result: 80 }),
        55
      ),
    })
  ).toEqual(3);

  expect(
    new BurstDamageStrategy(10, 0, 1, 6, 10)["getNumberOfShots"]({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChance({ result: 80 }),
        5
      ),
    })
  ).toBe(6);

  expect(
    new BurstDamageStrategy("d2", "d3+2", "d6", 6, 5)["getNumberOfShots"]({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChance({ result: 130 }),
        100
      ),
    })
  ).toBe(6);
});

test("Burst damage strategy applies damage properly", (test) => {
  const strategy = new BurstDamageStrategy(10, 0, 1, 6, 10);
  const fireOrder = new FireOrder("1", "2", "3", 3);
  const system = new Reactor({ id: 7, hitpoints: 200, armor: 3 }, 20);

  const combatLogEntry = new CombatLogWeaponFire("1", "2", "3", null);
  strategy.applyDamageFromWeaponFire({
    shooter: { getPosition: () => null } as unknown as Ship,
    target: {
      systems: {
        getSystemsForHit: () => [system],
      },
    } as unknown as Ship,
    fireOrder,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChance({ result: 80 }),
      55
    ),
    combatLogEntry,
  });

  expect(combatLogEntry.damages.length).toBe(3);
});

test("Explosive damage strategy will... um... explode", (test) => {
  const ship = new Ship({
    id: 999,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const damageStrategy = new ExplosiveDamageStrategy(5, 400, 4);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: (systems: ShipSystem[]) => systems[0],
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    fireOrder: new FireOrder("-1", "1", "2", 3),
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChance({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
  });

  const expectedDamage = 20;

  const totalDamage = ship.systems
    .getSystems()
    .reduce((total, system) => total + system.getTotalDamage(), 0);

  expect(totalDamage).toBe(expectedDamage);
});

test("Torpedo explosive damage strategy will also...  um... explode", (test) => {
  const ship = new Ship({
    id: 999,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const damageStrategy = new HETorpedoDamageStrategy(5, 400, 4);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: (systems) => systems[0],
  } as HitSystemRandomizer;

  const torpedoFlight = new TorpedoFlight(new Torpedo72HE(), "1", "1", 1, 1);
  torpedoFlight.setLaunchPosition(new Vector(1000, 0));

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    torpedoFlight,
    combatLogEntry: new CombatLogTorpedoAttack("1", "1"),
    shooter: null as unknown as Ship,
  });

  const expectedDamage = 20;

  const totalDamage = ship.systems
    .getSystems()
    .reduce((total, system) => total + system.getTotalDamage(), 0);

  expect(totalDamage).toBe(expectedDamage);
});
