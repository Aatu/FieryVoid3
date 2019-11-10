import test from "ava";
import {
  StandardDamageStrategy,
  BurstDamageStrategy
} from "../../model/unit/system/strategy/index.mjs";
import FireOrder from "../../model/weapon/FireOrder.mjs";
import FireOrderResult from "../../model/weapon/FireOrderResult.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/railgun/index.mjs";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/MovementTypes.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3
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

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  return ship;
};

test("Standard damage strategy overkills all the way to primary structure", test => {
  const ship = constructShip();
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

  const damageStrategy = new StandardDamageStrategy(400);

  damageStrategy.hitSystemRandomizer = {
    randomizeHitSystem: systems => systems[systems.length - 1]
  };

  damageStrategy._doDamage({
    target: ship,
    shooter,
    fireOrder: {
      id: 9090909090
    }
  });

  const destroyedIds = ship.systems
    .getSystems()
    .filter(system => system.isDestroyed())
    .map(system => system.id);
  test.deepEqual(destroyedIds, [].sort());
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
      requiredToHit: 80,
      rolledToHit: 55
    }),
    3
  );

  test.is(
    new BurstDamageStrategy(10, 0, 1, 6, 10)._getNumberOfShots({
      requiredToHit: 80,
      rolledToHit: 5
    }),
    6
  );

  test.is(
    new BurstDamageStrategy("d2", "d3+2", "d6", 6, 5)._getNumberOfShots({
      requiredToHit: 130,
      rolledToHit: 100
    }),
    6
  );
});

test("Burst damage strategy applies damage properly", test => {
  const strategy = new BurstDamageStrategy(10, 0, 1, 6, 10);
  const fireOrder = new FireOrder(1, 2, 3);
  fireOrder.setResult(new FireOrderResult());
  const system = new Reactor({ id: 7, hitpoints: 20, armor: 3 }, 20);

  strategy.applyDamageFromWeaponFire({
    shooter: { getShootingPosition: () => null },
    target: { systems: { getSystemsForHit: () => [system] } },
    weaponSettings: {},
    gameData: {},
    fireOrder,
    requiredToHit: 80,
    rolledToHit: 55
  });

  test.truthy(fireOrder.result.getDamageResolution());
});
