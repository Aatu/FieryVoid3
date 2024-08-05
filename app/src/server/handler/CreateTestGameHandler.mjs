import { v4 as uuidv4 } from "uuid";
import Caliope from "../../model/unit/ships/protectorate/Caliope.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import User from "../../model/User.mjs";
import GameData from "../../model/game/GameData.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/movementTypes.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import * as gamePhases from "../../model/game/gamePhases.mjs";
import * as gameStatuses from "../../model/game/gameStatuses.mjs";
import Fulcrum from "../../model/unit/ships/protectorate/Fulcrum.mjs";
import { USER_AI } from "../../model/AIUser.mjs";

class CreateTestGameHandler {
  initializeShip(serverShip, name, gameData, slot, user, position) {
    serverShip.name = name;
    serverShip.id = uuidv4();
    serverShip.slotId = slot.id;
    serverShip.gameId = gameData.id;
    serverShip.player.setUser(user);

    const startMove = new MovementOrder(
      uuidv4(),
      movementTypes.START,
      position,
      slot.deploymentVector,
      slot.facing,
      false,
      gameData.turn,
      0,
      undefined,
      1
    );

    serverShip.movement.addMovement(startMove);

    slot.addShip(serverShip);
    gameData.ships.addShip(serverShip);
    gameData.setActiveShip(serverShip);

    serverShip.movement.addMovement(
      new MovementOrder(
        uuidv4(),
        movementTypes.DEPLOY,
        startMove.position,
        startMove.velocity,
        startMove.facing,
        startMove.rolled,
        1,
        0,
        undefined,
        2
      )
    );
  }

  createTestShips(serverGameData, { useAI = false }) {
    const user1 = new User(1, "player1");
    const user2 = useAI ? USER_AI : new User(2, "player2");

    const slot1 = serverGameData.slots.slots[0];
    const slot2 = serverGameData.slots.slots[1];

    this.initializeShip(
      new Caliope(),
      "Test Caliope A1",
      serverGameData,
      slot1,
      user1,
      new Offset(60, 0)
    );

    this.initializeShip(
      new Fulcrum(),
      "Test Fulcrum A1",
      serverGameData,
      slot1,
      user1,
      new Offset(60, 2)
    );

    this.initializeShip(
      new Fulcrum(),
      "Test Fulcrum A2",
      serverGameData,
      slot1,
      user1,
      new Offset(60, -2)
    );

    this.initializeShip(
      new Caliope(),
      "Test Caliope B1",
      serverGameData,
      slot2,
      user2,
      new Offset(-60, 0)
    );

    this.initializeShip(
      new Fulcrum(),
      "Test Fulcrum B1",
      serverGameData,
      slot2,
      user2,
      new Offset(-60, 2)
    );

    this.initializeShip(
      new Fulcrum(),
      "Test Fulcrum B2",
      serverGameData,
      slot2,
      user2,
      new Offset(-60, -2)
    );

    serverGameData.setStatus(gameStatuses.ACTIVE);
    serverGameData.setPhase(gamePhases.GAME);
    serverGameData.ships.setShipLoadouts();

    return serverGameData;
  }

  createTestGame({ useAI = false }) {
    const user1 = new User(1, "player1");
    const user2 = useAI ? USER_AI : new User(2, "player2");

    const serverGamedata = new GameData();

    serverGamedata.name = "Test game";
    serverGamedata.creatorId = user1.id;

    serverGamedata.slots.addSlot(
      new GameSlot({
        name: "Great Expanse Protectorate",
        team: 1,
        points: 3000,
        userId: user1.id,
        deploymentLocation: new Offset(30, 0),
        deploymentVector: new Offset(-10, 0),
        facing: 3,
      })
    );

    serverGamedata.slots.addSlot(
      new GameSlot({
        name: "United Colonies",
        team: 2,
        points: 3000,
        userId: user2.id,
        deploymentLocation: new Offset(-30, 0),
        deploymentVector: new Offset(10, 0),
        facing: 0,
      })
    );

    serverGamedata.addPlayer(user1);
    serverGamedata.setPlayerActive(user1);
    serverGamedata.addPlayer(user2);
    serverGamedata.setPlayerActive(user2);
    console.log("players", serverGamedata.players);

    return serverGamedata;
  }
}

export default CreateTestGameHandler;
