import { expect, test } from "vitest";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import Torpedo158HE from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158HE";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";
import {
  Ammo120mmAP,
  Ammo30mm,
} from "../../../model/src/unit/system/weapon/ammunition/conventional";
import { BareTestShip } from "../../../model/src/unit/ships/test/TestShip";
import { CargoMove } from "../../../model/src/cargo/CargoMove";
import GameData from "../../../model/src/game/GameData";

test("Cargo can be moved", () => {
  const ship = new BareTestShip({ id: "123" });
  const from = new CargoBay({ id: 1000, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2000, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem(from);
  ship.systems.addPrimarySystem(to);

  const initialCargo = [
    new CargoEntry(new Torpedo158HE(), 5),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const moveCargo = [
    new CargoEntry(new Torpedo158HE(), 2),
    new CargoEntry(new Ammo30mm(), 200),
  ];

  from.handlers.addCargo(initialCargo);

  expect(from.handlers.getAllCargo()).toEqual(initialCargo);
  expect(from.handlers.getAllCargo()).not.toBe(initialCargo);

  ship.shipCargo.moveCargo(from, to, moveCargo);

  expect(ship.shipCargo["cargoMoves"].length).toEqual(1);

  const move = ship.shipCargo["cargoMoves"][0] as CargoMove;

  expect(move.to).toBe(to);
  expect(move.from).toBe(from);
  expect(move.cargoToMove).toEqual(moveCargo);
  expect(move.timeToMove).toEqual(10);

  const gameData = {
    combatLog: {
      addEntry: () => undefined,
    },
  } as unknown as GameData;

  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);

  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);

  expect(from.handlers.getAllCargo()).toEqual(initialCargo);
  expect(to.handlers.getAllCargo()).toEqual([]);

  ship.advanceTurn(gameData);

  expect(from.handlers.getAllCargo()).toEqual([]);
  console.log(
    to.id,
    to.handlers
      .getAllCargo()
      .map((c) => c.toString())
      .join(", ")
  );
  expect(to.handlers.getAllCargo()).toEqual(moveCargo);
});

test("Cargo move to opposite direction partially cancels other move", () => {
  const ship = new BareTestShip({ id: "123" });
  const from = new CargoBay({ id: 1000, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2000, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem(from);
  ship.systems.addPrimarySystem(to);

  const initialCargo = [
    new CargoEntry(new Torpedo158HE(), 5),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const moveCargo = [
    new CargoEntry(new Torpedo158HE(), 2),
    new CargoEntry(new Ammo30mm(), 200),
  ];

  to.handlers.addCargo([
    new CargoEntry(new Ammo120mmAP(), 100),
    new CargoEntry(new Torpedo158HE(), 5),
  ]);

  from.handlers.addCargo(initialCargo);

  expect(from.handlers.getAllCargo()).toEqual(initialCargo);
  expect(from.handlers.getAllCargo()).not.toBe(initialCargo);

  ship.shipCargo.moveCargo(from, to, moveCargo);

  expect(ship.shipCargo["cargoMoves"].length).toEqual(1);

  const move = ship.shipCargo["cargoMoves"][0] as CargoMove;

  expect(move.to).toBe(to);
  expect(move.from).toBe(from);
  expect(move.cargoToMove).toEqual(moveCargo);
  expect(move.timeToMove).toEqual(10);

  const gameData = {
    combatLog: {
      addEntry: () => undefined,
    },
  } as unknown as GameData;

  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);

  ship.shipCargo.moveCargo(to, from, [
    new CargoEntry(new Ammo120mmAP(), 100),
    new CargoEntry(new Torpedo158HE(), 4),
  ]);

  console.log(ship.shipCargo["cargoMoves"].map((m) => m.toString()));
  expect(ship.shipCargo["cargoMoves"].length).toEqual(2);
  expect(ship.shipCargo["cargoMoves"].map((m) => m.toString())).toEqual([
    "cargo move from Cargo bay 150m³ (id: 1000) to Cargo bay 150m³ (id: 2000) with cargo: Ammo30mm: 200",
    "cargo move from Cargo bay 150m³ (id: 2000) to Cargo bay 150m³ (id: 1000) with cargo: Ammo120mmAP: 100, Torpedo158HE: 2",
  ]);

  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);

  expect(ship.shipCargo["cargoMoves"].length).toBe(1);

  ship.advanceTurn(gameData);
  ship.advanceTurn(gameData);

  expect(ship.shipCargo["cargoMoves"].length).toBe(0);
  console.log(
    from.id,
    "all cargo",
    from.handlers.getAllCargo().map((m) => m.toString())
  );
  console.log(
    to.id,
    "all cargo",
    to.handlers.getAllCargo().map((m) => m.toString())
  );

  expect(to.handlers.getAllCargo().map((m) => m.toString())).toEqual([
    "Ammo120mmAP: 100",
    "Torpedo158HE: 5",
    "Ammo30mm: 200",
  ]);

  expect(from.handlers.getAllCargo().map((m) => m.toString())).toEqual([
    "Ammo120mmAP: 100",
    "Torpedo158HE: 5",
    "Ammo30mm: 200",
  ]);
});
