import test from "ava";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import { createShipObject } from "../../model/unit/createShipObject";
import DamageEntry from "../../model/unit/system/DamageEntry";
import User from "../../model/User";

import {
  OutputReduced8,
  OutputReduced6,
} from "../../model/unit/system/criticals";

test("Ship resolves valid power", (test) => {
  let ship = new TestShip({ id: 123 });
  ship.systems.getSystemById(7).addCritical(new OutputReduced8());
  ship.systems.getSystemById(7).addCritical(new OutputReduced6());

  test.false(ship.systems.power.isValidPower());
  ship.systems.power.forceValidPower();
  test.true(ship.systems.power.isValidPower());
});
