import test from "ava";
import TestShip from "../../model/unit/ships/test/TestShip";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import CriticalHandler from "../../server/handler/CriticalHandler.mjs";
import OutputReduced from "../../model/unit/system/criticals/OutputReduced.mjs";
import ForcedOffline from "../../model/unit/system/criticals/ForcedOffline.mjs";
import Ship from "../../model/unit/Ship.mjs";
import HeatSink from "../../model/unit/system/heat/HeatSink.mjs";
import Radiator from "../../model/unit/system/heat/Radiator.mjs";
import ShipSystem from "../../model/unit/system/ShipSystem.mjs";
import OutputHeatOnlineStrategy from "../../model/unit/system/strategy/OutputHeatOnlineStrategy.mjs";
import HeatHandler from "../../server/handler/HeatHandler.mjs";
import ForcedOfflineOverheat from "../../model/unit/system/criticals/ForcedOfflineOverheat.mjs";

test("Heat is generated", test => {
  const ship = new Ship({ id: 1 });
  const heater = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10)
  ]);

  ship.systems.addPrimarySystem([heater]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship]
    }
  });

  test.is(heater.heat.getHeat(), 10);
});

test("Heat is generated and stored", test => {
  const ship = new Ship({ id: 1 });
  const heater = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10)
  ]);
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);

  ship.systems.addPrimarySystem([heater, heatSink]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship]
    }
  });

  test.is(heater.heat.getHeat(), 6);
  test.is(heatSink.heat.getHeat(), 4);
});

test("Heat is generated, stored and radiated", test => {
  const ship = new Ship({ id: 1 });
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);
  const radiator = new Radiator({ id: 3, hitpoints: 10, armor: 2 }, 5);
  const heater = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10)
  ]);

  ship.systems.addPrimarySystem([heatSink, radiator, heater]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship]
    }
  });

  test.is(heater.heat.getHeat(), 6);
  test.is(heatSink.heat.getHeat(), 0);
  test.is(radiator.callHandler("getRadiatedHeat"), 4);
});

test("Heat is generated, stored and radiated, complicately", test => {
  const ship = new Ship({ id: 1 });
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);
  const radiator = new Radiator({ id: 3, hitpoints: 10, armor: 2 }, 5);
  const heater = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10)
  ]);
  const heatSink2 = new HeatSink({ id: 5, hitpoints: 10, armor: 2 }, 20);
  const heater2 = new ShipSystem({ id: 7, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(20)
  ]);

  ship.systems.addPrimarySystem([
    heatSink,
    radiator,
    heater,
    heatSink2,
    heater2
  ]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship]
    }
  });

  test.is(heater.heat.getHeat(), 6);
  test.is(heater2.heat.getHeat(), 16);
  test.is(heatSink.heat.getHeat(), 1);
  test.is(heatSink2.heat.getHeat(), 2);
  test.is(radiator.callHandler("getRadiatedHeat"), 5);
});

test("System overheats", test => {
  const ship = new Ship({ id: 1 });
  const heater1 = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10)
  ]);

  const heater2 = new ShipSystem({ id: 5, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(4)
  ]);

  const heater3 = new ShipSystem({ id: 6, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(5)
  ]);

  ship.systems.addPrimarySystem([heater1, heater2, heater3]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship]
    }
  });

  test.is(heater1.heat.getOverHeat(), 1.5);
  test.true(heater1.hasCritical(ForcedOfflineOverheat));
  test.is(heater2.heat.getOverHeat(), 0);
  test.is(heater3.heat.getOverHeat(), 0.25);
});