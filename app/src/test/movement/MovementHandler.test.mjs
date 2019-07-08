import test from "ava";
import GameData from "../../model/game/GameData";
import MovementHandler from "../../server/handler/MovementHandler";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
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
  1
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(5, -5),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  1
);

const getMovementService = () =>
  new MovementService().update({ turn: 1 }, { relayEvent: () => null });

const constructShip = (id = 123, player) => {
  let ship = new TestShip({ id, player });
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id, player) => {
  const ship = constructShip(id);
  ship.player.setUser(player);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setId(null)
        .round()
    ),
    moves2.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setId(null)
        .round()
    )
  );
};

test("Submit movement", test => {
  const serverGame = new GameData({
    id: 123,
    turn: 1,
    phase: 1,
    activeShips: [1, 2]
  });

  const user = new User(989, "Nönmän");
  const ship = constructDeployedShip(1, user);
  const ship2 = constructDeployedShip(2, new User(666, "Bädmän"));
  serverGame.ships.addShip(ship).addShip(ship2);

  const clientGame = new GameData().deserialize(serverGame.serialize());
  test.deepEqual(serverGame.serialize(), clientGame.serialize());

  const movementService = getMovementService();

  const movingShip = clientGame.ships.getShipById(1);
  movementService.roll(movingShip);
  movementService.evade(movingShip, 1);
  movementService.evade(movingShip, 1);
  movementService.pivot(movingShip, 1);
  movementService.thrust(movingShip, 1);
  movementService.thrust(movingShip, 1);
  movementService.thrust(movingShip, 1);
  movementService.thrust(movingShip, 1);

  const movementHandler = new MovementHandler();

  movementHandler.receiveMoves(
    serverGame,
    new GameData().deserialize(clientGame.serialize()),
    serverGame.getActiveShipsForUser(user),
    user
  );

  compareMovements(
    test,
    serverGame.ships.getShipById(1).movement.getMovement(),
    [...clientGame.ships.getShipById(1).movement.getMovement()]
  );

  test.is(serverGame.ships.getShipById(2).movement.getMovement().length, 2);
});
