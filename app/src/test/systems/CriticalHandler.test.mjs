import test from "ava";
import TestShip from "../../model/unit/ships/test/TestShip";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import CriticalHandler from "../../server/handler/CriticalHandler.mjs";
import OutputReduced from "../../model/unit/system/criticals/OutputReduced.mjs";
import ForcedOffline from "../../model/unit/system/criticals/ForcedOffline.mjs";

test("Critical handler adds a critical", test => {
  const ship = new TestShip({ id: 1 });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = criticals => {
    return criticals[criticals.length - 1].critical;
  };
  criticalHandler.getRandomBonus = () => 50;

  criticalHandler.advance({ ships: { getShips: () => [ship] } });

  test.deepEqual(engine.damage.getCriticals(), [new ForcedOffline(4)]);
});

test("Critical handler upgrades a critical", test => {
  const ship = new TestShip({ id: 1 });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));
  engine.addCritical(new OutputReduced(2, 2));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = criticals => {
    return new OutputReduced(2, 3);
  };
  criticalHandler.getRandomBonus = () => 50;

  criticalHandler.advance({ ships: { getShips: () => [ship] } });

  test.deepEqual(engine.damage.getCriticals(), [new OutputReduced(2, 3)]);
});

test("Critical handler chooses best critical if ceiling is too high", test => {
  const ship = new TestShip({ id: 1 });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(5));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = criticals => {
    throw new Error("this should never be called");
  };
  criticalHandler.getRandomBonus = () => 50;
  criticalHandler.getCeil = () => 100;
  criticalHandler.getFloor = () => 100;

  criticalHandler.advance({ ships: { getShips: () => [ship] } });

  test.deepEqual(engine.damage.getCriticals(), [new OutputReduced(6)]);
});

test("Critical handler does not add a critical if dice says so", test => {
  const ship = new TestShip({ id: 1 });
  const engine = ship.systems.getSystemById(5);
  engine.addDamage(new DamageEntry(1));

  const criticalHandler = new CriticalHandler();
  criticalHandler.randomizeCritical = criticals => {
    throw new Error("this should never be called");
  };
  criticalHandler.getRandomBonus = () => 1;

  criticalHandler.advance({ ships: { getShips: () => [ship] } });

  test.deepEqual(engine.damage.getCriticals(), []);
});
