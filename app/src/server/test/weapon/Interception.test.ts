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
import StandardHitStrategy from "../../../model/src/unit/system/strategy/weapon/StandardHitStrategy";
import { TorpedoHandler } from "../../handler/TorpedoHandler";
import { TorpedoFlightForIntercept } from "../../../model/src/unit/TorpedoFlightForIntercept";
import CombatLogTorpedoIntercept from "../../../model/src/combatLog/CombatLogTorpedoIntercept";
import Torpedo from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import CombatLogTorpedoAttack from "../../../model/src/combatLog/CombatLogTorpedoAttack";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";
import { Ammo30mm } from "../../../model/src/unit/system/weapon/ammunition/conventional";
import AmmunitionStrategy from "../../../model/src/unit/system/strategy/weapon/AmmunitionStrategy";

const createShips = () => {
  const ship = new Ship({
    id: "1",
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase);
  ship.frontHitProfile = 50;
  ship.sideHitProfile = 50;

  const cargoBay = new CargoBay({ id: 666, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 14, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
    new EwArray({ id: 9, hitpoints: 20, armor: 5 }, 8),
    cargoBay,
  ]);

  ship.shipCargo.addCargo(new CargoEntry(new Ammo30mm(), 500));

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

  ship.setShipLoadout();

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

  return gameData;
};

const launchTorpedo = (gameData: GameData, torpedo: Torpedo) => {
  const flight = new TorpedoFlight(torpedo, "1", "2", 3);
  flight.setLaunchPosition(new Vector(1000, 0));
  flight.setStrikePosition(new Vector(500, 0));
  gameData.torpedos.addTorpedoFlights(flight);
};

test("Torpedo flight for intercept encapsulates data", () => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const target = gameData.ships.getShipById("1");
  const torpedoFlight = new TorpedoFlightForIntercept(
    gameData.torpedos.getTorpedoFlights()[0],
    target
  );

  expect(torpedoFlight.getCurrentHexPosition()).toEqual(new Offset(12, 0));
  torpedoFlight.advance();
  expect(torpedoFlight.getCurrentHexPosition()).toEqual(new Offset(11, 0));

  let steps = 11;

  while (steps--) {
    torpedoFlight.advance();
    if (torpedoFlight.isStricking(target)) {
      break;
    }
  }

  expect(torpedoFlight.getCurrentHexPosition()).toEqual(new Offset(4, 0));
  expect(torpedoFlight.isStricking(target)).toBe(true);
});

test("Ship can try to intercept torpedo", () => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  const pdc = target.systems.getSystemById(14)!;
  target.electronicWarfare.assignCcEw(8);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoIntercept;

  expect(logEntry).toBeInstanceOf(CombatLogTorpedoIntercept);
  expect(logEntry.intercepts[0].hitChance.result).toEqual(22);
});

test("Torpedo can not be intercepted, if weapon is offline", (test) => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  const pdc = target.systems.getSystemById(14)!;
  pdc.power.setOffline();
  target.electronicWarfare.assignCcEw(8);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoAttack;
  expect(gameData.combatLog.entries.length).toEqual(1);
  expect(logEntry).toBeInstanceOf(CombatLogTorpedoAttack);
});

test("Torpedo can not be intercepted, if weapon is out of ammo", (test) => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  const pdc = target.systems.getSystemById(14)!;
  const ammoStrategy =
    pdc.getStrategiesByInstance<AmmunitionStrategy>(AmmunitionStrategy)[0];
  ammoStrategy.shotsInMagazine = 0;
  target.electronicWarfare.assignCcEw(8);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoAttack;
  expect(gameData.combatLog.entries.length).toEqual(1);
  expect(logEntry).toBeInstanceOf(CombatLogTorpedoAttack);
});

test("Torpedo can not be intercepted, if weapon is not on arc", (test) => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  const pdc = target.systems.getSystemById(14)!;
  pdc.power.setOffline();
  target.electronicWarfare.assignCcEw(8);
  target.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 90, end: 270 }),
  ]);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoAttack;
  expect(gameData.combatLog.entries.length).toEqual(1);
  expect(logEntry).toBeInstanceOf(CombatLogTorpedoAttack);
});

test("Torpedo can not be intercepted, if weapon is already used", (test) => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  const pdc = target.systems.getSystemById(14)!;
  pdc.handlers.addUsedIntercept(6);
  target.electronicWarfare.assignCcEw(8);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoAttack;
  expect(gameData.combatLog.entries.length).toEqual(1);
  expect(logEntry).toBeInstanceOf(CombatLogTorpedoAttack);
});

test("Better interceptor is used first", (test) => {
  const gameData = createShips();
  launchTorpedo(gameData, new Torpedo158MSV());
  const handler = new TorpedoHandler();
  const target = gameData.ships.getShipById("1");
  target.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
  ]);
  const pdc = target.systems.getSystemById(14)!;
  const pdc2 = target.systems.getSystemById(15);

  const s = pdc2.strategies.find(
    (strategy: unknown) => strategy instanceof StandardHitStrategy
  ) as StandardHitStrategy;

  s.fireControl = 50;

  target.electronicWarfare.assignCcEw(8);

  handler.advance(gameData);

  const logEntry = gameData.combatLog.entries[0] as CombatLogTorpedoIntercept;
  expect(logEntry).toBeInstanceOf(CombatLogTorpedoIntercept);
  expect(logEntry.intercepts[0].interceptorId).toEqual(15);
});
