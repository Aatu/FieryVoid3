import { expect, test } from "vitest";
import Engine from "../../../model/src/unit/system/engine/Engine";
import Reactor from "../../../model/src/unit/system/reactor/Reactor";
import ShipSystems from "../../../model/src/unit/ShipSystems";
import Ship from "../../../model/src/unit/Ship";
import PDC30mm from "../../../model/src/unit/system/weapon/pdc/PDC30mm";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import CoilgunLightFixed from "../../../model/src/unit/system/weapon/coilgun/CoilgunLightFixed";
import OutputReduced8 from "../../../model/src/unit/system/criticals/OutputReduced8";
import GameData from "../../../model/src/game/GameData";
import { GAME_PHASE } from "../../../model/src/game/gamePhase";

test("System can change its power states", () => {
  const engine = new Engine({ id: 123, hitpoints: 10, armor: 3 }, 12, 6, 2);
  expect(engine.power.canSetOffline()).toBe(true);
  engine.power.setOffline();
  expect(engine.power.isOffline()).toBe(true);
  expect(engine.isDisabled()).toBe(true);
});

test("Bunch of systems generate power", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const reactor2 = new Reactor({ id: 2, hitpoints: 10, armor: 3 }, 10);
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    reactor2,
    engine1,
    engine2,
  ]);

  expect(systems.getSystems().length).toEqual(4);
  expect(systems.power.getPowerOutput()).toEqual(20);
  expect(systems.power.getPowerRequired()).toEqual(12);
  expect(systems.power.getRemainingPowerOutput()).toEqual(8);
  expect(systems.power.isValidPower()).toBe(true);

  systems.addPrimarySystem(
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 12, 2)
  );

  expect(systems.power.getRemainingPowerOutput()).toBe(-4);
  expect(systems.power.isValidPower()).toBe(false);
  engine2.power.setOffline();

  expect(systems.power.getRemainingPowerOutput()).toBe(2);
  expect(systems.power.isValidPower()).toBe(true);
});

test("System can be turned offline", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const reactor2 = new Reactor({ id: 2, hitpoints: 10, armor: 3 }, 10);
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    reactor2,
    engine1,
    engine2,
  ]);

  expect(systems.getSystems().length).toBe(4);
  engine1.power.setOffline();
  expect(engine1.power.isGoingOffline()).toBe(true);
  expect(systems.power.getRemainingPowerOutput()).toBe(14);
  expect(engine1.power.isOffline()).toEqual(true);
  engine1.power.setOnline();
  expect(systems.power.getRemainingPowerOutput()).toBe(8);
  expect(engine1.power.isOffline()).toBe(false);

  engine1.power.setOffline();
  systems.advanceTurn(1);

  expect(engine1.power.isOffline()).toBe(true);
  expect(systems.power.getRemainingPowerOutput()).toBe(14);

  engine1.power.setOnline();
  expect(engine1.power.isGoingOnline()).toBe(true);
});

test("Invalid power test", (test) => {
  const engine1 = new Engine({ id: 3, hitpoints: 10, armor: 3 }, 12, 6, 2);
  const engine2 = new Engine({ id: 4, hitpoints: 10, armor: 3 }, 12, 6, 2);

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    engine1,
    engine2,
  ]);

  expect(systems.power.isValidPower()).toBe(false);
  engine1.power.setOffline();
  engine2.power.setOffline();
  expect(systems.power.isValidPower()).toBe(true);
});

test("Offline state prevents loading", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 10);
  const pdc1 = new PDC30mm(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    pdc1,
  ]);

  systems.advanceTurn(2);
  expect(pdc1.callHandler(SYSTEM_HANDLERS.getTurnsLoaded, undefined, 0)).toBe(
    2
  );
  pdc1.power.setOffline();
  expect(pdc1.isDisabled()).toBe(true);
  systems.advanceTurn(3);
  expect(pdc1.isDisabled()).toBe(true);
  expect(pdc1.callHandler(SYSTEM_HANDLERS.getTurnsLoaded, undefined, 0)).toBe(
    0
  );
});

test("Weapon can be boosted", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 16);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    coilgun,
  ]);

  expect(
    coilgun.callHandler(SYSTEM_HANDLERS.isBoostable, undefined, true)
  ).toBe(true);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.canBoost, undefined, true)).toBe(
    true
  );
  coilgun.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.canBoost, undefined, false)).toBe(
    false
  );

  expect(systems.power.getRemainingPowerOutput()).toBe(4);
  coilgun.callHandler(SYSTEM_HANDLERS.deBoost, undefined, undefined);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.canBoost, undefined, true)).toBe(
    true
  );
  expect(systems.power.getRemainingPowerOutput()).toBe(10);

  reactor1.addCritical(new OutputReduced8());

  expect(
    coilgun.callHandler(SYSTEM_HANDLERS.isBoostable, undefined, true)
  ).toBe(true);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.canBoost, undefined, true)).toBe(
    false
  );
});

test("Weapon boost affects its loading time", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 20);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    coilgun,
  ]);

  coilgun.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  coilgun.callHandler(SYSTEM_HANDLERS.onWeaponFired, undefined, undefined);
  systems.advanceTurn(1);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.getLoadingTime, null, 0)).toBe(4);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.getTurnsLoaded, null, 0)).toBe(
    1.3333333333333333
  );
  systems.advanceTurn(2);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.getTurnsLoaded, null, 0)).toBe(
    2.6666666666666666
  );
  systems.advanceTurn(3);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.getTurnsLoaded, null, 0)).toBe(4);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.isLoaded, undefined, true)).toBe(
    true
  );
});

test("Engine boost affects thrust output", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 20);
  const engine = new Engine({ id: 2, hitpoints: 10, armor: 3 }, 10, 5, 3);

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    engine,
  ]);
  systems.ship = {
    movement: {
      revertMovementsUntilValidMovement: () => {},
    },
  } as Ship;

  engine.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  engine.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  engine.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);

  expect(systems.power.getRemainingPowerOutput()).toBe(6);
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(13);
  engine.callHandler(SYSTEM_HANDLERS.deBoost, undefined, undefined);
  expect(
    engine.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, 0)
  ).toBe(12);
});

test("Boosted system passes its state to server", () => {
  const reactor1 = new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 30);
  const coilgun = new CoilgunLightFixed(
    { id: 213, hitpoints: 5, armor: 3 },
    { start: 180, end: 0 }
  );

  const systems = new ShipSystems(null as unknown as Ship).addPrimarySystem([
    reactor1,
    coilgun,
  ]);

  const serverSystems = new ShipSystems(
    null as unknown as Ship
  ).addPrimarySystem([
    new Reactor({ id: 1, hitpoints: 10, armor: 3 }, 30),
    new CoilgunLightFixed(
      { id: 213, hitpoints: 5, armor: 3 },
      { start: 180, end: 0 }
    ),
  ]);

  coilgun.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  coilgun.callHandler(SYSTEM_HANDLERS.boost, undefined, undefined);
  expect(coilgun.callHandler(SYSTEM_HANDLERS.getBoost, undefined, 0)).toBe(2);

  serverSystems.receivePlayerData(
    { systems } as Ship,
    null as unknown as GameData,
    GAME_PHASE.GAME
  );

  expect(
    serverSystems
      .getSystemById(213)
      .callHandler(SYSTEM_HANDLERS.getBoost, undefined, 0)
  ).toBe(2);

  coilgun.callHandler(SYSTEM_HANDLERS.deBoost, undefined, undefined);
  serverSystems.receivePlayerData(
    { systems } as Ship,
    null as unknown as GameData,
    GAME_PHASE.GAME
  );
  expect(
    serverSystems
      .getSystemById(213)
      .callHandler(SYSTEM_HANDLERS.getBoost, undefined, 0)
  ).toBe(1);
});
