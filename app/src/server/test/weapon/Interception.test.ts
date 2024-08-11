import { expect, test } from "vitest";
import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import { PDC30mm } from "../../../model/src/unit/system/weapon/pdc";
import { Reactor } from "../../../model/src/unit/system/reactor";
import { Structure } from "../../../model/src/unit/system/structure";
import { EwArray } from "../../../model/src/unit/system/electronicWarfare";
import { MOVEMENT_TYPE, MovementOrder } from "../../../model/src/movement";
import { Offset } from "../../../model/src/hexagon";
import TorpedoFlight from "../../../model/src/unit/TorpedoFlight";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import Vector from "../../../model/src/utils/Vector";
import GameData from "../../../model/src/game/GameData";
import { User } from "../../../model/src/User/User";
import GameSlot from "../../../model/src/game/GameSlot";
import TorpedoHandler from "../../handler/TorpedoHandler";
import TorpedoAttackService from "../../../model/src/weapon/TorpedoAttackService";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import StandardHitStrategy from "../../../model/src/unit/system/strategy/weapon/StandardHitStrategy";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import WeaponHitChance from "../../../model/src/weapon/WeaponHitChance";

const createShipAndTorpedo = () => {
  const ship = new Ship({
    id: "1",
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);
  ship.frontHitProfile = 50;
  ship.sideHitProfile = 50;

  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 14, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
    new EwArray({ id: 9, hitpoints: 20, armor: 5 }, 8),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      "-1",
      MOVEMENT_TYPE.DEPLOY,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      false,
      1,
      0,
      null,
      1
    )
  );

  ship.electronicWarfare.activatePlannedElectronicWarfare();

  const shooter = new Ship({
    id: "2",
    shipData: {
      player: { id: 2, username: "u2" },
    },
  } as unknown as ShipBase);
  shooter.systems.addPrimarySystem([
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  const torpedo = new TorpedoFlight(new Torpedo158MSV(), "1", "2", 3, 1);
  torpedo.setLaunchPosition(new Vector(1000, 0));
  torpedo.setStrikePosition(new Vector(500, 0));

  const gameData = new GameData();

  ship
    .getPlayer()
    .setUser(new User({ id: 1, username: "testUser", accessLevel: 1 }));

  const slot = new GameSlot(
    {
      userId: 1,
    },
    gameData
  );

  slot.addShip(ship);
  gameData.ships.addShip(ship);
  gameData.slots.addSlot(slot);

  shooter
    .getPlayer()
    .setUser(new User({ id: 2, username: "testEnemy", accessLevel: 1 }));
  const slot2 = new GameSlot(
    {
      userId: 2,
    },
    gameData
  );

  slot2.addShip(shooter);
  gameData.ships.addShip(shooter);
  gameData.slots.addSlot(slot2);

  gameData.torpedos.addTorpedoFlights(torpedo);

  return gameData;
};

test("Torpedo can be intercepted", () => {
  const gameData = createShipAndTorpedo();
  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    []
  );

  expect(interceptor).toBeDefined();
  expect((interceptor as ShipSystem).id).toEqual(14);
});

test("Torpedo can not be intercepted, if weapon is offline", (test) => {
  const gameData = createShipAndTorpedo();

  const pdc = gameData.ships.getShips()[0].systems.getSystemById(14);
  pdc.power.setOffline();

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    []
  );

  expect(interceptor).not.toBeDefined();
});

test("Torpedo can not be intercepted, if weapon is not on arc", (test) => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  const pdc = ship.systems.getSystemById(14);
  pdc.power.setOffline();

  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 90, end: 270 }),
  ]);

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    []
  );

  expect(interceptor).not.toBeDefined();
});

test("Torpedo can not be intercepted, if weapon is already used", (test) => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  const pdc = ship.systems.getSystemById(14);

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [pdc]
  );

  expect(interceptor).not.toBeDefined();
});

test("Better interceptor is used first", (test) => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
  ]);

  const pdc = ship.systems.getSystemById(15);
  const pdc2 = ship.systems.getSystemById(14);

  const s = pdc.strategies.find(
    (strategy) => strategy instanceof StandardHitStrategy
  ) as StandardHitStrategy;

  s.fireControl = 50;

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    []
  );

  expect(interceptor).toBeDefined();
  expect((interceptor as ShipSystem).id).toEqual(15);
});

test("Intercept hit change is calculated properly", (test) => {
  const gameData = createShipAndTorpedo();
  const ship = gameData.ships.getShips()[0];
  ship.electronicWarfare.assignCcEw(8);
  const pdc = ship.systems.getSystemById(14);

  ship.movement.isRolling = () => true;

  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];
  const result = pdc.callHandler(
    SYSTEM_HANDLERS.getInterceptChance,
    {
      target: ship,
      torpedoFlight,
    },
    null as unknown as WeaponHitChance
  );

  expect(result).toEqual(
    new WeaponHitChance({
      absoluteResult: 30,
      baseToHit: 0,
      dew: 0,
      distance: 2,
      evasion: 30,
      fireControl: 30,
      oew: 8,
      outOfRange: false,
      rangeModifier: -20,
      rollingPenalty: -20,
      result: 30,
    })
  );
});
