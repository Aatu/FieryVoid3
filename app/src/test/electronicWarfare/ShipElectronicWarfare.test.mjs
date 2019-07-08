import test from "ava";
import systems from "../../model/unit/system";
import ShipElectronicWarfare from "../../model/unit/ShipElectronicWarfare";

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

const constructTestShipElectronicWarfare = allSystems =>
  new ShipElectronicWarfare({
    id: "puuppa-alus",
    systems: {
      getSystems: () => allSystems
    }
  });

test("Assign offensive electronic warfare succesfully", test => {
  const shipEW = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEW.assignOffensiveEw("tuupero", 6);
  shipEW.assignOffensiveEw("nuupero", 1);

  test.is(shipEW.getDefensiveEw(), 3);
  test.is(shipEW.getOffensiveEw("tuupero"), 6);
  test.is(shipEW.getOffensiveEw("nuupero"), 1);
});

test("Assign too much offensive electronic warfare", test => {
  const shipEW = constructTestShipElectronicWarfare([
    new systems.EwArray({ id: 1, hitpoints: 10, armor: 3 }, 10)
  ]);

  shipEW.assignOffensiveEw("tuupero", 6);
  shipEW.assignOffensiveEw("nuupero", 1);

  const error = test.throws(() => shipEW.assignOffensiveEw("Iona", 7));
  test.is(error.message, "Check ew validity first!");
});
