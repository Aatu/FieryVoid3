import test from "ava";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import PDC30mm from "../../model/unit/system/weapon/pdc/PDC30mm.mjs";

import ShipSystems from "../../model/unit/ShipSystems.mjs";
import CoilgunLightFixed from "../../model/unit/system/weapon/railgun/CoilgunLightFixed.mjs";
import { OutputReduced8 } from "../../model/unit/system/criticals/index.mjs";

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

test("Weapon can be boosted", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 16);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems().addPrimarySystem([reactor1, coilgun]);

  test.true(coilgun.callHandler("isBoostable"));
  test.true(coilgun.callHandler("canBoost"));
  coilgun.callHandler("boost");
  test.false(coilgun.callHandler("canBoost"));

  test.is(systems.power.getRemainingPowerOutput(), 0);
  coilgun.callHandler("deBoost");
  test.true(coilgun.callHandler("canBoost"));
  test.is(systems.power.getRemainingPowerOutput(), 8);

  reactor1.addCritical(new OutputReduced8());

  test.true(coilgun.callHandler("isBoostable"));
  test.false(coilgun.callHandler("canBoost"));

  /*
  systems.advanceTurn(2);
  test.is(pdc1.callHandler("getTurnsLoaded"), 1);
  pdc1.power.setOffline();
  test.true(pdc1.isDisabled());
  systems.advanceTurn(3);
  test.true(pdc1.isDisabled());
  test.is(pdc1.callHandler("getTurnsLoaded"), 0);
  */
});

test("Weapon boost affects its loading time", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 20);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems().addPrimarySystem([reactor1, coilgun]);

  coilgun.callHandler("boost");
  coilgun.callHandler("onWeaponFired");
  test.is(coilgun.callHandler("getLoadingTime", null, 0), 3);
  test.is(coilgun.callHandler("getTurnsLoaded", null, 0), 0);
  systems.advanceTurn();
  test.is(coilgun.callHandler("getTurnsLoaded", null, 0), 2);
  systems.advanceTurn();
  test.is(coilgun.callHandler("getTurnsLoaded", null, 0), 3);
  test.true(coilgun.callHandler("isLoaded"));
});

test("Engine boost affects thrust output", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 20);
  const engine = new Engine({ id: 2, hitpoints: 10, armor: 3 }, 10, 5, 3);

  const systems = new ShipSystems().addPrimarySystem([reactor1, engine]);
  systems.ship = {
    movement: {
      revertMovementsUntilValidMovement: () => {}
    }
  };

  engine.callHandler("boost");
  engine.callHandler("boost");
  engine.callHandler("boost");
  test.is(systems.power.getRemainingPowerOutput(), 6);
  test.is(engine.callHandler("getThrustOutput"), 13);
  engine.callHandler("deBoost");
  test.is(engine.callHandler("getThrustOutput"), 12);
});

test("Boosted system passes its state to server", test => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 30);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems().addPrimarySystem([reactor1, coilgun]);

  const serverSystems = new ShipSystems().addPrimarySystem([
    new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 30),
    new CoilgunLightFixed(
      { id: 213, hitpoints: 5, armor: 3 },
      { start: 180, end: 0 }
    )
  ]);

  coilgun.callHandler("boost");
  coilgun.callHandler("boost");
  serverSystems.receivePlayerData({ systems });
  test.is(serverSystems.getSystemById(213).callHandler("getBoost"), 2);
  coilgun.callHandler("deBoost");
  serverSystems.receivePlayerData({ systems });
  test.is(serverSystems.getSystemById(213).callHandler("getBoost"), 1);
});
