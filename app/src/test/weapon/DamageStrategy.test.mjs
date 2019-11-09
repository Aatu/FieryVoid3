import test from "ava";
import {
  StandardDamageStrategy,
  BurstDamageStrategy
} from "../../model/unit/system/strategy/index.mjs";
import FireOrder from "../../model/weapon/FireOrder.mjs";
import FireOrderResult from "../../model/weapon/FireOrderResult.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";

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
      requiredToHit: 114,
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
    shooter: { getPosition: () => null },
    target: { systems: { getSystemsForHit: () => [system] } },
    weaponSettings: {},
    gameData: {},
    fireOrder,
    requiredToHit: 80,
    rolledToHit: 55
  });

  test.truthy(fireOrder.result.getDamageResolution());
});
