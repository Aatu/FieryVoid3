import { expect, test } from "vitest";
import Ship from "../../../model/src/unit/Ship";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import OutputHeatOnlineStrategy from "../../../model/src/unit/system/strategy/OutputHeatOnlineStrategy";
import HeatHandler from "../../handler/HeatHandler";
import GameData from "../../../model/src/game/GameData";
import ShipSystemLogEntryHeat from "../../../model/src/unit/system/ShipSystemLog/ShipSystemLogEntryHeat";

test("Heat is generated", (test) => {
  const ship = new Ship({ id: "1" });
  const heater = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);

  ship.systems.addPrimarySystem([heater]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  } as unknown as GameData);

  expect(
    heater.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage()
  ).toEqual([
    "Added 10 and cooled 0 units of heat.",
    "Current system heat was 10. Overheating 250%.",
    "System forced offline until overheat is less than 50%.",
  ]);
  expect(heater.heat.getOverheat()).toBe(10);
});

/*
test("Heat is generated and stored", (test) => {
  const ship = new Ship({ id: 1 });
  const heater = new ShipSystem({ id: 4, hitpoints: 8, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);

  ship.systems.addPrimarySystem([heater, heatSink]);
  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater.heat.getOverheat(), 6);
  test.is(heatSink.heat.getHeat(), 4);

  test.deepEqual(
    heater.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage(),
    [
      "Added 10 and cooled 4 units of heat.",
      "Current system heat was 6. Overheating 75%.",
    ]
  );

  test.deepEqual(
    heatSink.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage(),
    [
      "Added 4 units of heat. Transfered 0 units of heat to radiators.",
      "Stored 4 units of heat.",
    ]
  );
});

test("Heat is generated, stored and radiated", (test) => {
  const ship = new Ship({ id: 1 });
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);
  const radiator = new Radiator({ id: 3, hitpoints: 10, armor: 2 }, 5);
  const heater = new ShipSystem({ id: 4, hitpoints: 8, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);

  ship.systems.addPrimarySystem([heatSink, radiator, heater]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  heater.deserialize(heater.serialize());
  heatSink.deserialize(heatSink.serialize());
  radiator.deserialize(radiator.serialize());

  test.is(heater.heat.getOverheat(), 6);
  test.is(heatSink.heat.getHeat(), 0);
  test.is(radiator.callHandler("getRadiatedHeat"), 4);

  test.deepEqual(
    heater.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage(),
    [
      "Added 10 and cooled 4 units of heat.",
      "Current system heat was 6. Overheating 75%.",
    ]
  );

  test.deepEqual(
    heatSink.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage(),
    [
      "Added 4 units of heat. Transfered 4 units of heat to radiators.",
      "Stored 0 units of heat.",
    ]
  );

  test.deepEqual(
    radiator.log.getOpenLogEntryByClass(ShipSystemLogEntryHeat).getMessage(),
    ["Radiated 4 units of heat."]
  );
});

test("Heat is generated, stored and radiated, complicately", (test) => {
  const ship = new Ship({ id: 1 });
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);
  const radiator = new Radiator({ id: 3, hitpoints: 10, armor: 2 }, 5);
  const heater = new ShipSystem({ id: 4, hitpoints: 8, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);
  const heatSink2 = new HeatSink({ id: 5, hitpoints: 10, armor: 2 }, 20);
  const heater2 = new ShipSystem({ id: 7, hitpoints: 8, armor: 2 }, [
    new OutputHeatOnlineStrategy(20),
  ]);

  ship.systems.addPrimarySystem([
    heatSink,
    radiator,
    heater,
    heatSink2,
    heater2,
  ]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater.heat.getOverheat(), 6);
  test.is(heater2.heat.getOverheat(), 16);
  test.is(heatSink.heat.getHeat(), 1);
  test.is(heatSink2.heat.getHeat(), 2);
  test.is(radiator.callHandler("getRadiatedHeat"), 5);
});

test("System overheats", (test) => {
  const ship = new Ship({ id: 1 });
  const heater1 = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);

  const heater2 = new ShipSystem({ id: 5, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(4),
  ]);

  const heater3 = new ShipSystem({ id: 6, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(2),
  ]);

  ship.systems.addPrimarySystem([heater1, heater2, heater3]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater1.heat.getOverheatPercentage(), 2.5);
  test.true(heater1.hasCritical(ForcedOfflineOverheat));
  test.is(heater2.heat.getOverheatPercentage(), 1);
  test.is(heater3.heat.getOverheatPercentage(), 0.5);
});

test("System overheat is reduced at reduced rate", (test) => {
  const ship = new Ship({ id: 1 });
  const heater1 = new ShipSystem({ id: 4, hitpoints: 4, armor: 2 }, [
    new OutputHeatOnlineStrategy(1, 1, 0.25),
  ]);

  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);

  ship.systems.addPrimarySystem([heater1, heatSink]);

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater1.heat.getOverheatPercentage(), 0);
  test.is(heater1.heat.getHeat(), 0);

  heater1.advanceTurn();
  heatSink.advanceTurn();

  heater1.heat.heat = 3;

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater1.heat.getHeat(), 0);
  test.is(heater1.heat.getOverheat(), 2);
  test.is(heater1.heat.getOverheatPercentage(), 0.5);

  heater1.advanceTurn();
  heatSink.advanceTurn();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater1.heat.getHeat(), 0);
  test.is(heater1.heat.getOverheat(), 1.5);
  test.is(heater1.heat.getOverheatPercentage(), 0.375);
});

test("Damaged radiator radiates less heat", (test) => {
  const ship = new Ship({ id: 1 });
  const heatSink = new HeatSink({ id: 2, hitpoints: 10, armor: 2 }, 20);
  const radiator = new Radiator({ id: 3, hitpoints: 10, armor: 2 }, 5);
  const heater = new ShipSystem({ id: 4, hitpoints: 8, armor: 2 }, [
    new OutputHeatOnlineStrategy(10),
  ]);

  ship.systems.addPrimarySystem([heatSink, radiator, heater]);

  radiator.addDamage(new DamageEntry(5));

  const heatHandler = new HeatHandler();

  heatHandler.advance({
    ships: {
      getShips: () => [ship],
    },
  });

  test.is(heater.heat.getOverheat(), 6);
  test.is(heatSink.heat.getHeat(), 2);
  test.is(radiator.callHandler("getRadiatedHeat"), 2);
});
*/
