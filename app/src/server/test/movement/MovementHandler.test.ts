import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import {
  MOVEMENT_TYPE,
  MovementService,
  RequiredThrust,
} from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import GameData, { SerializedGameData } from "../../../model/src/game/GameData";
import TestShip from "../../../model/src/unit/ships/test/TestShip";
import { User } from "../../../model/src/User/User";
import MovementHandler from "../../handler/MovementHandler";

const startMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  1
);

const deployMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.DEPLOY,
  new Offset(5, -5),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  1
);

const getMovementService = () =>
  new MovementService().update({ turn: 1 } as unknown as GameData, {
    relayEvent: () => null,
  });

const constructShip = (id: string = "123", player: User) => {
  let ship = new TestShip({ id, player }).setShipLoadout();
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id: string, player: User) => {
  const ship = constructShip(id, player);
  ship.player.setUser(player);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (moves1: MovementOrder[], moves2: MovementOrder[]) => {
  expect(
    moves1.map((move) =>
      move
        .clone()
        .setRequiredThrust(null as unknown as RequiredThrust)
        .setId(null)
    )
  ).toEqual(
    moves2.map((move) =>
      move
        .clone()
        .setRequiredThrust(null as unknown as RequiredThrust)
        .setId(null)
    )
  );
};

test("Submit movement", (test) => {
  const serverGame = new GameData({
    id: 123,
    turn: 1,
    phase: 1,
    activeShips: ["1", "2"],
  } as unknown as SerializedGameData);

  const user = new User({ id: 989, username: "Nönmän" });
  const ship = constructDeployedShip("1", user);
  const ship2 = constructDeployedShip(
    "2",
    new User({ id: 666, username: "Bädmän" })
  );
  serverGame.ships.addShip(ship).addShip(ship2);

  const clientGame = new GameData().deserialize(serverGame.serialize());
  expect(serverGame.serialize()).toEqual(clientGame.serialize());

  const movementService = getMovementService();

  const movingShip = clientGame.ships.getShipById("1");

  movementService.roll(movingShip);
  movementService.evade(movingShip, 1);
  movementService.pivot(movingShip, 1);
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

  compareMovements(serverGame.ships.getShipById("1").movement.getMovement(), [
    ...clientGame.ships.getShipById("1").movement.getMovement(),
  ]);

  expect(serverGame.ships.getShipById("2").movement.getMovement().length).toBe(
    2
  );
});
