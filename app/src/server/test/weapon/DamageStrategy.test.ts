import { expect, expectTypeOf, test } from "vitest";
import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import Structure from "../../../model/src/unit/system/structure/Structure";
import Engine from "../../../model/src/unit/system/engine/Engine";
import Reactor from "../../../model/src/unit/system/reactor/Reactor";
import PDC30mm from "../../../model/src/unit/system/weapon/pdc/PDC30mm";
import { MOVEMENT_TYPE, MovementOrder } from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import HitSystemRandomizer from "../../../model/src/unit/system/strategy/weapon/utils/HitSystemRandomizer";
import CombatLogWeaponFire from "../../../model/src/combatLog/CombatLogWeaponFire";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import TorpedoFlight from "../../../model/src/unit/TorpedoFlight";
import Torpedo72HE from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo72HE";
import Vector from "../../../model/src/utils/Vector";
import CombatLogTorpedoAttack from "../../../model/src/combatLog/CombatLogTorpedoAttack";
import {
  UnifiedDamageStrategy,
  UnifiedDamageStrategyArgs,
} from "../../../model/src/unit/system/strategy/weapon/UnifiedDamageStrategy";
import { systemsToNameIdString } from "../helpers";
import TorpedoDamageStrategy from "../../../model/src/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/TorpedoDamageStrategy";

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
  const damageStrategy = new UnifiedDamageStrategy({
    iterations: 1,
    armorPiercingFormula: 1000,
    damageFormula: 400,
    overPenetrationDamageMultiplier: 1,
    damageArmorModifier: 1,
  });

  const hitSystemRandomizer = {
    randomizeHitSystem: (systems) => {
      return systems[0];
    },
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    attackPosition: shooter.getPosition(),
    argsOverrider: {
      getDamageOverrider: (args: UnifiedDamageStrategyArgs) => args,
    },
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    hitSystemRandomizer,
  });

  const destroyedIds = systemsToNameIdString(
    ship.systems.getSystems().filter((s) => s.isDestroyed())
  );

  expect(destroyedIds).toEqual([
    "Structure id: '100'",
    "Engine id: '6'",
    "Structure id: '8'",
    "Structure id: '400'",
  ]);
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

  const hitSystemRandomizer = {
    randomizeHitSystem: (systems) => {
      if (i > systems.length - 1) {
        i = 0;
      }

      const system = systems[i];
      i++;

      return system;
    },
  } as HitSystemRandomizer;

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0));
  const damageStrategy = new UnifiedDamageStrategy({
    iterations: 1,
    armorPiercingFormula: 1000,
    damageFormula: 1,
    overPenetrationDamageMultiplier: 1,
    damageArmorModifier: 1,
  });

  let i = 0;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    attackPosition: shooter.getPosition(),
    argsOverrider: {
      getDamageOverrider: (args: UnifiedDamageStrategyArgs) => args,
    },
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    hitSystemRandomizer,
  });

  const damagedIds = systemsToNameIdString(
    ship.systems.getSystems().filter((system) => system.getTotalDamage() > 0)
  );

  expect(damagedIds).toEqual([
    "Reactor id: '7'",
    "Structure id: '8'",
    "30mm PDC id: '501'",
    "Structure id: '500'",
    "30mm PDC id: '201'",
    "Structure id: '200'",
    "Structure id: '400'",
  ]);
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
  const damageStrategy = new UnifiedDamageStrategy({
    iterations: 1,
    armorPiercingFormula: 3,
    damageFormula: 1,
    overPenetrationDamageMultiplier: 1,
    damageArmorModifier: 1,
  });

  let i = 0;
  const hitSystemRandomizer = {
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
    attackPosition: shooter.getPosition(),
    argsOverrider: {
      getDamageOverrider: (args: UnifiedDamageStrategyArgs) => args,
    },
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    hitSystemRandomizer,
  });

  const destroyedIds = systemsToNameIdString(
    ship.systems.getSystems().filter((system) => system.getTotalDamage() > 0)
  );

  expect(destroyedIds).toEqual(["30mm PDC id: '501'", "Structure id: '400'"]);
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

  const damageStrategy = new UnifiedDamageStrategy({
    iterations: 4,
    armorPiercingFormula: 5,
    damageFormula: 5,
    overPenetrationDamageMultiplier: 1,
    damageArmorModifier: 1,
  });

  const hitSystemRandomizer = {
    randomizeHitSystem: (systems: ShipSystem[]) => systems[0],
  } as HitSystemRandomizer;

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    attackPosition: shooter.getPosition(),
    argsOverrider: {
      getDamageOverrider: (args: UnifiedDamageStrategyArgs) => args,
    },
    combatLogEntry: new CombatLogWeaponFire("-1", "1", "2", null),
    hitSystemRandomizer,
  });

  const expectedDamage = 28;

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

  const damageStrategy = new TorpedoDamageStrategy({
    iterations: 4,
    armorPiercingFormula: 5,
    damageFormula: 5,
    overPenetrationDamageMultiplier: 1,
    damageArmorModifier: 1,
  });

  const hitSystemRandomizer = {
    randomizeHitSystem: (systems) => systems[0],
  } as HitSystemRandomizer;

  const torpedoFlight = new TorpedoFlight(new Torpedo72HE(), "1", "1", 1, 1);
  torpedoFlight.setLaunchPosition(new Vector(1000, 0));

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    torpedoFlight,
    combatLogEntry: new CombatLogTorpedoAttack("1", "1"),
    hitSystemRandomizer,
  });

  const expectedDamage = 30;

  const totalDamage = ship.systems
    .getSystems()
    .reduce((total, system) => total + system.getTotalDamage(), 0);

  expect(totalDamage).toBe(expectedDamage);
});
