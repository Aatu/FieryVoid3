import test from "ava";
import {
  StandardDamageStrategy,
  BurstDamageStrategy,
  PiercingDamageStrategy,
  ExplosiveDamageStrategy
} from "../../model/unit/system/strategy/index.mjs";
import FireOrder from "../../model/weapon/FireOrder.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/coilgun/index.mjs";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/MovementTypes.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import WeaponHitChange from "../../model/weapon/WeaponHitChange.mjs";
import CombatLogWeaponFire from "../../model/combatLog/CombatLogWeaponFire.mjs";
import CombatLogWeaponFireHitResult from "../../model/combatLog/CombatLogWeaponFireHitResult.mjs";
import HETorpedoDamageStrategy from "../../model/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/HETorpedoDamageStrategy.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Torpedo72HE from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo72HE.mjs";
import CombatLogTorpedoAttack from "../../model/combatLog/CombatLogTorpedoAttack.mjs";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3
  });

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  return ship;
};

test("Standard damage strategy overkills all the way trough", test => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  const damageStrategy = new StandardDamageStrategy(400, 10);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => systems[0]
  };

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    fireOrder: new FireOrder(),
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChange({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire()
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter(system => system.isDestroyed())
    .map(system => system.id);
  test.deepEqual(destroyedIds.sort(), [6, 8, 400, 100].sort());
});

test("Piercing damage strategy will damage multiple systems", test => {
  const ship = new Ship({
    id: 999
  });

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  const damageStrategy = new PiercingDamageStrategy(1, 400, 10);

  let i = 0;
  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => {
      if (i > systems.length - 1) {
        i = 0;
      }

      const system = systems[i];
      i++;

      return system;
    }
  };

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChange({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire(),
    fireOrder: new FireOrder()
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter(system => system.getTotalDamage() > 0)
    .map(system => system.id);
  test.deepEqual(destroyedIds.sort(), [400, 500, 501, 6, 7, 8].sort());
});

test("Piercing damage strategy will stop when armor piercing runs out", test => {
  const ship = new Ship({
    id: 999
  });

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(400, 0, 0));
  const damageStrategy = new PiercingDamageStrategy(1, 3, 10);

  let i = 0;
  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => {
      if (i > systems.length - 1) {
        i = 0;
      }

      const system = systems[i];
      i++;

      return system;
    }
  };

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChange({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire(),
    fireOrder: new FireOrder()
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter(system => system.getTotalDamage() > 0)
    .map(system => system.id);
  test.deepEqual(destroyedIds.sort(), [400, 501].sort());
});

test("Damage strategy returns reasonable damage numbers", test => {
  test.is(new StandardDamageStrategy(10)._getDamageForWeaponHit({}), 10);
  test.true(
    Number.isInteger(
      new StandardDamageStrategy("2d4 + 10")._getDamageForWeaponHit({})
    )
  );
  test.true(
    Number.isInteger(
      new StandardDamageStrategy("2d4+10")._getDamageForWeaponHit({})
    )
  );
});

test("Burst damage strategy amount of shots works", test => {
  test.is(
    new BurstDamageStrategy(10, 0, 1, 6, 10)._getNumberOfShots({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChange({ result: 80 }),
        55
      )
    }),
    3
  );

  test.is(
    new BurstDamageStrategy(10, 0, 1, 6, 10)._getNumberOfShots({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChange({ result: 80 }),
        5
      )
    }),
    6
  );

  test.is(
    new BurstDamageStrategy("d2", "d3+2", "d6", 6, 5)._getNumberOfShots({
      hitResolution: new CombatLogWeaponFireHitResult(
        true,
        new WeaponHitChange({ result: 130 }),
        100
      )
    }),
    6
  );
});

test("Burst damage strategy applies damage properly", test => {
  const strategy = new BurstDamageStrategy(10, 0, 1, 6, 10);
  const fireOrder = new FireOrder(1, 2, 3);
  const system = new Reactor({ id: 7, hitpoints: 200, armor: 3 }, 20);

  const combatLogEntry = new CombatLogWeaponFire();
  strategy.applyDamageFromWeaponFire({
    shooter: { getPosition: () => null },
    target: { systems: { getSystemsForHit: () => [system] } },
    weaponSettings: {},
    gameData: {},
    fireOrder,
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChange({ result: 80 }),
      55
    ),
    combatLogEntry
  });

  test.is(combatLogEntry.damages.length, 3);
});

test("Explosive damage strategy will... um... explode", test => {
  const ship = new Ship({
    id: 999
  });

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201, hitpoints: 5, armor: 3 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const damageStrategy = new ExplosiveDamageStrategy(5, 400, 4);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => systems[0]
  };

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    fireOrder: new FireOrder(),
    hitResolution: new CombatLogWeaponFireHitResult(
      true,
      new WeaponHitChange({ result: 10 }),
      10
    ),
    combatLogEntry: new CombatLogWeaponFire()
  });

  const expectedDamage = 20;

  const totalDamage = ship.systems
    .getSystems()
    .reduce((total, system) => total + system.getTotalDamage(), 0);

  test.deepEqual(totalDamage, expectedDamage);
});

test("Torpedo explosive damage strategy will also...  um... explode", test => {
  const ship = new Ship({
    id: 999
  });

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardFrontSystem([
    new PDC30mm({ id: 201, hitpoints: 5, armor: 3 }),
    new Structure({ id: 200, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const damageStrategy = new HETorpedoDamageStrategy(5, 400, 4);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => systems[0]
  };

  const torpedoFlight = new TorpedoFlight(new Torpedo72HE(), 1, 1, 1, 1);
  torpedoFlight.setLaunchPosition(new Vector(1000, 0));

  damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    torpedoFlight,
    combatLogEvent: new CombatLogTorpedoAttack(1, 1)
  });

  const expectedDamage = 20;

  const totalDamage = ship.systems
    .getSystems()
    .reduce((total, system) => total + system.getTotalDamage(), 0);

  test.deepEqual(totalDamage, expectedDamage);
});
