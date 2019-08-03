import test from "ava";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import PDC30mm from "../../model/unit/system/weapon/pdc/PDC30mm.mjs";

import ShipSystems from "../../model/unit/ShipSystems.mjs";

test("System can change its power states", test => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  test.true(engine.power.canSetOffline());
  engine.power.setOffline();
  test.true(engine.power.isOffline());
  test.true(engine.isDisabled());
});

test("Bunch of systems generate power", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const reactor2 = new Reactor({ id: 2, hitpoints: 10, armor: 3 }, 10);
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems().addPrimarySystem([
    reactor1,
    reactor2,
    engine1,
    engine2
  ]);

  test.deepEqual(systems.getSystems().length, 4);
  test.deepEqual(systems.power.getPowerOutput(), 20);
  test.deepEqual(systems.power.getPowerRequired(), 12);
  test.deepEqual(systems.power.getRemainingPowerOutput(), 8);
  test.true(systems.power.isValidPower());

  systems.addPrimarySystem(
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 12, 2)
  );

  test.deepEqual(systems.power.getRemainingPowerOutput(), -4);
  test.false(systems.power.isValidPower());
  engine2.power.setOffline();

  test.deepEqual(systems.power.getRemainingPowerOutput(), 2);
  test.true(systems.power.isValidPower());
});

test("System can be turned offline", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const reactor2 = new Reactor({ id: 2, hitpoints: 10, armor: 3 }, 10);
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems().addPrimarySystem([
    reactor1,
    reactor2,
    engine1,
    engine2
  ]);

  test.deepEqual(systems.getSystems().length, 4);
  engine1.power.setOffline();
  test.true(engine1.power.isGoingOffline());
  test.deepEqual(systems.power.getRemainingPowerOutput(), 14);
  test.true(engine1.power.isOffline());
  engine1.power.setOnline();
  test.deepEqual(systems.power.getRemainingPowerOutput(), 8);
  test.false(engine1.power.isOffline());

  engine1.power.setOffline();
  systems.advanceTurn();

  test.true(engine1.power.isOffline());
  test.deepEqual(systems.power.getRemainingPowerOutput(), 14);

  engine1.power.setOnline();
  test.true(engine1.power.isGoingOnline());
});

test("Invalid power test", test => {
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems().addPrimarySystem([engine1, engine2]);

  test.false(systems.power.isValidPower());
  engine1.power.setOffline();
  engine2.power.setOffline();
  test.true(systems.power.isValidPower());
});

test("Offline state prevents loading", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const pdc1 = new PDC30mm(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems().addPrimarySystem([reactor1, pdc1]);

  systems.advanceTurn(2);
  test.is(pdc1.callHandler("getTurnsLoaded"), 1);
  pdc1.power.setOffline();
  test.true(pdc1.isDisabled());
  systems.advanceTurn(3);
  test.true(pdc1.isDisabled());
  test.is(pdc1.callHandler("getTurnsLoaded"), 0);
});
