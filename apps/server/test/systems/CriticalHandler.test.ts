import { expect, test } from "vitest";
import TestShip from "../../../model/src/unit/ships/test/TestShip";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import CriticalHandler from "../../handler/CriticalHandler";
import GameData from "../../../model/src/game/GameData";
import ForcedOffline from "../../../model/src/unit/system/criticals/ForcedOffline";
import ShipSystemLogEntryCriticalHit from "../../../model/src/unit/system/ShipSystemLog/ShipSystemLogEntryCriticalHit";
import OutputReduced from "../../../model/src/unit/system/criticals/OutputReduced";

test("Critical handler adds a critical", () => {
  const ship = new TestShip({ id: "1" });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = (criticals) => {
    return criticals[criticals.length - 1].critical;
  };
  criticalHandler.getRandomBonus = () => 50;

  criticalHandler.advance({
    ships: { getShips: () => [ship] },
  } as unknown as GameData);

  const actual = engine.damage.getCriticals()[0];
  actual.id = "";
  const expected = new ForcedOffline(4);
  expected.id = "";
  expect(actual).toEqual(expected);

  const logEntry = engine.log.getOpenLogEntryByClass(
    ShipSystemLogEntryCriticalHit
  );

  expect(logEntry.getMessage()).toEqual([
    "Tested for critical damage:",
    "Existing damage: 0, new: 38, overheat: 0, random: 50, total: 88",
    "Resulted in critical:",
    '"Forced offline for 5 turns"',
  ]);
});

test("Critical handler upgrades a critical", (test) => {
  const ship = new TestShip({ id: "1" });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));
  engine.addCritical(new OutputReduced(2, 2));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = (criticals) => {
    return new OutputReduced(2, 3);
  };
  criticalHandler.getRandomBonus = () => 50;

  criticalHandler.advance({
    ships: { getShips: () => [ship] },
  } as unknown as GameData);

  const actual = engine.damage.getCriticals()[0];
  actual.id = "";
  const expected = new OutputReduced(2, 3);
  expected.id = "";
  expect(actual).toEqual(expected);
});

test("Critical handler chooses best critical if ceiling is too high", (test) => {
  const ship = new TestShip({ id: "1" });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = (criticals) => {
    throw new Error("this should never be called");
  };
  criticalHandler.getRandomBonus = () => 50;
  criticalHandler.getCeil = () => 100;
  criticalHandler.getFloor = () => 100;

  criticalHandler.advance({
    ships: { getShips: () => [ship] },
  } as unknown as GameData);

  const actual = engine.damage.getCriticals()[0];
  actual.id = "";
  const expected = new OutputReduced(6);
  expected.id = "";
  expect(actual).toEqual(expected);
});

test("Critical handler does not add a critical if dice says so", (test) => {
  const ship = new TestShip({ id: "1" });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(1));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = (criticals) => {
    throw new Error("this should never be called");
  };
  criticalHandler.getRandomBonus = () => 1;

  criticalHandler.advance({
    ships: { getShips: () => [ship] },
  } as unknown as GameData);

  expect(engine.damage.getCriticals()).toEqual([]);
});
