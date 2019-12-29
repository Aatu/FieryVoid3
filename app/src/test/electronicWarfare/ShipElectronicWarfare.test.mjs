import test from "ava";
import systems from "../../model/unit/system";
import ShipElectronicWarfare from "../../model/unit/ShipElectronicWarfare";
import { OutputReduced2 } from "../../model/unit/system/criticals";
import TestShip from "../../model/unit/ships/test/TestShip.mjs";

const constructTestShipElectronicWarfare = allSystems =>
  new ShipElectronicWarfare({
    id: "puuppa-alus",
    systems: {
      getSystems: () => allSystems
    }
  });

test("Assign offensive electronic warfare succesfully", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("nuupero", 1);

  test.is(shipEw.getDefensiveEw(), 3);
  test.is(shipEw.getOffensiveEw("tuupero"), 6);
  test.is(shipEw.getOffensiveEw("nuupero"), 1);
});

test("Assign too much offensive electronic warfare", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("nuupero", 1);

  const error = test.throws(() => shipEw.assignOffensiveEw("Iona", 7));
  test.is(error.message, "Invalid EW");
});

test("Deassign electronic warfare", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10),
    new systems.EwArray({ id: 2, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignOffensiveEw("tuupero", 1);
  shipEw.assignOffensiveEw("tuupero", 8);
  shipEw.assignOffensiveEw("tuupero", 6);
  shipEw.assignOffensiveEw("tuupero", -1);
  shipEw.assignOffensiveEw("tuupero", -4);
  shipEw.assignOffensiveEw("tuupero", -6);

  test.is(shipEw.getDefensiveEw(), 16);
  test.is(shipEw.getOffensiveEw("tuupero"), 4);
});

test("Deassigning offensive electronic warfare fails with unhandled negative entries", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignOffensiveEw("tuupero", 6);

  const error = test.throws(() => shipEw.assignOffensiveEw("tuupero", -86));
  test.is(error.message, "Invalid EW, negative entries left");
});

test("Assign close combat electronic warfare", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignCcEw(3);

  test.is(shipEw.getCcEw(), 3);
  test.is(shipEw.getDefensiveEw(), 7);
});

test("Assign close combat and offensive electronic warfare", test => {
  const shipEw = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(3);

  test.is(shipEw.getCcEw(), 3);
  test.is(shipEw.getDefensiveEw(), 2);
  test.is(shipEw.getOffensiveEw("tuupero"), 3);
  test.is(shipEw.getOffensiveEw("nuupero"), 2);
});

test("Assign offensive electronic warfare with multiple arrays", test => {
  const array1 = new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new systems.EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 6);

  test.is(shipEw.getDefensiveEw(), 4);
  test.is(shipEw.getOffensiveEw("tuupero"), 6);

  const entries1 = array1.callHandler("getEwEntries");
  const entries2 = array2.callHandler("getEwEntries");
  test.is(entries1.length, 1);
  test.is(entries2.length, 1);
});

test("Assign mixed electronic warfare with multiple arrays", test => {
  const array1 = new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new systems.EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(3);

  test.is(shipEw.getCcEw(), 3);
  test.is(shipEw.getDefensiveEw(), 2);
  test.is(shipEw.getOffensiveEw("tuupero"), 3);
  test.is(shipEw.getOffensiveEw("nuupero"), 2);
});

test("Assign mixed electronic warfare to arrays with critical damage", test => {
  const array1 = new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new systems.EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  array2.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(2);

  test.is(shipEw.getCcEw(), 2);
  test.is(shipEw.getDefensiveEw(), 1);
  test.is(shipEw.getOffensiveEw("tuupero"), 3);
  test.is(shipEw.getOffensiveEw("nuupero"), 2);
});

test("Assign mixed electronic warfare to arrays with critical damage fails", test => {
  const array1 = new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 5);
  const array2 = new systems.EwArray({ id: 2, hitpoints: 10, armor: 3 }, 5);
  array2.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1, array2]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);

  const error = test.throws(() => shipEw.assignCcEw(4));
  test.is(error.message, "Invalid EW");
});

test("System serializes and deserializes nicely", test => {
  const array1 = new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10);
  array1.addCritical(new OutputReduced2());
  const shipEw = constructTestShipElectronicWarfare([array1]);

  shipEw.assignOffensiveEw("tuupero", 3);
  shipEw.assignOffensiveEw("nuupero", 2);
  shipEw.assignCcEw(2);

  test.is(shipEw.getCcEw(), 2);
  test.is(shipEw.getDefensiveEw(), 1);
  test.is(shipEw.getOffensiveEw("tuupero"), 3);
  test.is(shipEw.getOffensiveEw("nuupero"), 2);

  const array3 = new systems.EwArray(
    { id: 1, hitpoints: 10, armor: 3 },
    10
  ).deserialize(array1.serialize());

  const shipEw2 = constructTestShipElectronicWarfare([array3]);

  test.is(shipEw2.getCcEw(), 2);
  test.is(shipEw2.getDefensiveEw(), 1);
  test.is(shipEw2.getOffensiveEw("tuupero"), 3);
  test.is(shipEw2.getOffensiveEw("nuupero"), 2);
});

test("Electronic warfare array can be boosted", test => {
  const ship = new TestShip();
  const ewArray = ship.systems.getSystemById(11);
  ship.systems.getSystemById(5).power.setOffline();
  ship.systems.getSystemById(6).power.setOffline();
  test.true(ship.electronicWarfare.canAssignCcEw(10));
  test.false(ship.electronicWarfare.canAssignCcEw(11));
  test.true(ewArray.callHandler("canBoost"));
  ewArray.callHandler("boost");
  test.true(ship.electronicWarfare.canAssignCcEw(11));
  ewArray.callHandler("deBoost");
  test.false(ship.electronicWarfare.canAssignCcEw(11));
});

test("When deboosting electronic warfare array, extra ew will be removed", test => {
  const ship = new TestShip({ id: 1 });
  const ship2 = new TestShip({ id: 2 });

  const ewArray = ship.systems.getSystemById(11);
  ship.systems.getSystemById(5).power.setOffline();
  ship.systems.getSystemById(6).power.setOffline();
  ewArray.callHandler("boost");

  ship.electronicWarfare.assignOffensiveEw(ship2, 5);
  ship.electronicWarfare.assignCcEw(6);
  ewArray.callHandler("deBoost");

  test.is(ship.electronicWarfare.getCcEw(), 6);
  test.is(ship.electronicWarfare.getDefensiveEw(), 0);
  test.is(ship.electronicWarfare.getOffensiveEw(ship2), 4);
  ewArray.power.setOffline();
  test.is(ship.electronicWarfare.getCcEw(), 0);
  test.is(ship.electronicWarfare.getDefensiveEw(), 0);
  test.is(ship.electronicWarfare.getOffensiveEw(ship2), 0);
});

test("When setting ew array ofline, it will remove assigned ew", test => {
  const ship = new TestShip({ id: 1 });
  const ship2 = new TestShip({ id: 2 });

  const ewArray = ship.systems.getSystemById(11);

  ship.electronicWarfare.assignOffensiveEw(ship2, 5);
  ship.electronicWarfare.assignCcEw(5);

  test.is(ship.electronicWarfare.getCcEw(), 5);
  test.is(ship.electronicWarfare.getDefensiveEw(), 0);
  test.is(ship.electronicWarfare.getOffensiveEw(ship2), 5);
  ewArray.power.setOffline();
  test.is(ship.electronicWarfare.getCcEw(), 0);
  test.is(ship.electronicWarfare.getDefensiveEw(), 0);
  test.is(ship.electronicWarfare.getOffensiveEw(ship2), 0);
});
