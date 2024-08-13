import { expect, test } from "vitest";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import ShipElectronicWarfare from "../../../model/src/unit/ShipElectronicWarfare";
import Ship from "../../../model/src/unit/Ship";
import EwArray from "../../../model/src/unit/system/electronicWarfare/EwArray";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import ElectronicWarfareEntry from "../../../model/src/electronicWarfare/ElectronicWarfareEntry";
import OutputReduced2 from "../../../model/src/unit/system/criticals/OutputReduced2";
import TestShip from "../../../model/src/unit/ships/test/TestShip";

const constructTestShipElectronicWarfare = (allSystems: ShipSystem[]) =>
  new ShipElectronicWarfare({
    id: "puuppa-alus",
    systems: {
      getSystems: () => allSystems,
    },
    getId: () => "puuppa-alus",
  } as unknown as Ship);

test("Assign offensive electronic warfare succesfully", () => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("nuupero", 1);

  expect(shipEw.getDefensiveEw()).toBe(3);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(6);
  expect(shipEw.getOffensiveEw("nuupero")).toBe(1);
});

test("Assign too much offensive electronic warfare", (test) => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("nuupero", 1);

  expect(() => shipEw.assignOffensiveEw("Iona", 7)).toThrow("Invalid EW");
});

test("Deassign electronic warfare", (test) => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
    new EwArray({ id: 2, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignOffensiveEw("tuupero", 1);
  shipEw.assignOffensiveEw("tuupero", 8);
  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("tuupero", -1);
  shipEw.assignOffensiveEw("tuupero", -4);
  shipEw.assignOffensiveEw("tuupero", -6);

  expect(shipEw.getDefensiveEw()).toBe(16);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(4);
});

test("Deassigning offensive electronic warfare fails with unhandled negative entries", (test) => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);

  expect(() => shipEw.assignOffensiveEw("tuupero", -86)).toThrow(
    "Invalid EW, negative entries left"
  );
});

test("Assign close combat electronic warfare", (test) => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignCcEw(3);

  expect(shipEw.getCcEw()).toBe(3);
  expect(shipEw.getDefensiveEw()).toBe(7);
});

test("Assign close combat and offensive electronic warfare", (test) => {
  const shipEw = constructTestShipElectronicWarfare([
    new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
  ]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(3);

  expect(shipEw.getCcEw()).toBe(3);
  expect(shipEw.getDefensiveEw()).toBe(2);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(3);
  expect(shipEw.getOffensiveEw("nuupero")).toBe(2);
});

test("Assign offensive electronic warfare with multiple arrays", (test) => {
  const array1 = new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 6);

  expect(shipEw.getDefensiveEw()).toBe(4);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(6);

  const entries1 = array1.callHandler(
    SYSTEM_HANDLERS.getEwEntries,
    undefined,
    [] as ElectronicWarfareEntry[]
  );
  const entries2 = array2.callHandler(
    SYSTEM_HANDLERS.getEwEntries,
    undefined,
    [] as ElectronicWarfareEntry[]
  );
  expect(entries1.length).toBe(1);
  expect(entries2.length).toBe(1);
});

test("Assign mixed electronic warfare with multiple arrays", (test) => {
  const array1 = new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(3);

  expect(shipEw.getCcEw()).toBe(3);
  expect(shipEw.getDefensiveEw()).toBe(2);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(3);
  expect(shipEw.getOffensiveEw("nuupero")).toBe(2);
});

test("Assign mixed electronic warfare to arrays with critical damage", (test) => {
  const array1 = new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  array2.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(2);

  expect(shipEw.getCcEw()).toBe(2);
  expect(shipEw.getDefensiveEw()).toBe(1);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(3);
  expect(shipEw.getOffensiveEw("nuupero")).toBe(2);
});

test("Assign mixed electronic warfare to arrays with critical damage fails", (test) => {
  const array1 = new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  array2.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);

  expect(() => shipEw.assignCcEw(4)).toThrow("Invalid EW");
});

test("System serializes and deserializes nicely", (test) => {
  const array1 = new EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10);
  array1.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(2);

  expect(shipEw.getCcEw()).toBe(2);
  expect(shipEw.getDefensiveEw()).toBe(1);
  expect(shipEw.getOffensiveEw("tuupero")).toBe(3);
  expect(shipEw.getOffensiveEw("nuupero")).toBe(2);

  const array3 = new EwArray(
    { id: 1, hitpoints: 10, armor: 3 },
    10
  ).deserialize(array1.serialize());

  const shipEw2 = constructTestShipElectronicWarfare([array3]);

  expect(shipEw2.getCcEw()).toBe(2);
  expect(shipEw2.getDefensiveEw()).toBe(1);
  expect(shipEw2.getOffensiveEw("tuupero")).toBe(3);
  expect(shipEw2.getOffensiveEw("nuupero")).toBe(2);
});

test("Electronic warfare array can be boosted", (test) => {
  const ship = new TestShip();
  const ewArray = ship.systems.getSystemById(11);
  ship.systems.getSystemById(5).power.setOffline();
  ship.systems.getSystemById(6).power.setOffline();
  expect(ship.electronicWarfare.canAssignCcEw(10)).toBe(true);
  expect(ship.electronicWarfare.canAssignCcEw(11)).toBe(false);
  expect(ewArray.handlers.canBoost()).toBe(true);
  ewArray.handlers.boost();
  expect(ship.electronicWarfare.canAssignCcEw(11)).toBe(true);
  ewArray.handlers.deBoost();
  expect(ship.electronicWarfare.canAssignCcEw(11)).toBe(false);
});

/*
test("When deboosting electronic warfare array, extra ew will be removed", (test) => {
  const ship = new TestShip({ id: 1 });
  const ship2 = new TestShip({ id: 2 });

  const ewArray = ship.systems.getSystemById(11);
  ship.systems.getSystemById(5).power.setOffline();
  ship.systems.getSystemById(6).power.setOffline();
  ewArray.callHandler("boost");

  ship.electronicWarfare.assignOffensiveEw(ship2, 5);
  ship.electronicWarfare.assignCcEw(6);
  ewArray.callHandler("deBoost");

  expect(ship.electronicWarfare.getCcEw(), 6);
  expect(ship.electronicWarfare.getDefensiveEw(), 0);
  expect(ship.electronicWarfare.getOffensiveEw(ship2), 4);
  ewArray.power.setOffline();
  expect(ship.electronicWarfare.getCcEw(), 0);
  expect(ship.electronicWarfare.getDefensiveEw(), 0);
  expect(ship.electronicWarfare.getOffensiveEw(ship2), 0);
});

test("When setting ew array ofline, it will remove assigned ew", (test) => {
  const ship = new TestShip({ id: 1 });
  const ship2 = new TestShip({ id: 2 });

  const ewArray = ship.systems.getSystemById(11);

  ship.electronicWarfare.assignOffensiveEw(ship2, 5);
  ship.electronicWarfare.assignCcEw(5);

  expect(ship.electronicWarfare.getCcEw(), 5);
  expect(ship.electronicWarfare.getDefensiveEw(), 0);
  expect(ship.electronicWarfare.getOffensiveEw(ship2), 5);
  ewArray.power.setOffline();
  expect(ship.electronicWarfare.getCcEw(), 0);
  expect(ship.electronicWarfare.getDefensiveEw(), 0);
  expect(ship.electronicWarfare.getOffensiveEw(ship2), 0);
});
*/
