import test from "ava";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import createShipObject from "../../model/unit/createShipObject";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import User from "../../model/User";

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  999
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(0, 0),
  startMove.target,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update(
    { turn: 999 },
    { onShipMovementChanged: () => null }
  );

const constructShip = (id = 123, user) => {
  let ship = new TestShip({ id: 123, player: user });
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id, user) => {
  const ship = constructShip(id, user);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move => move.clone().setRequiredThrust(null)),
    moves2.map(move => move.clone().setRequiredThrust(null))
  );
};

test("Ship serializes and deserializes nicely", test => {
  const user = new User(345, "Nönmän");
  const ship = constructDeployedShip(123, user);

  ship.systems.getSystemById(4).addDamage(new DamageEntry(20));
  ship.systems.getSystemById(1).addCritical(new EfficiencyHalved());

  const ship2 = createShipObject(ship.serialize());

  compareMovements(
    test,
    ship.movement.getMovement(),
    ship2.movement.getMovement()
  );

  test.true(ship.systems.getSystemById(4).isDisabled());
  test.true(ship.systems.getSystemById(1).hasCritical(EfficiencyHalved));
  test.deepEqual(ship.player.user, user);
});
