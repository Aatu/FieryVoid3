import { v4 as uuidv4 } from "uuid";
import Ship from "../../model/src/unit/Ship";
import GameData from "../../model/src/game/GameData";
import GameSlot from "../../model/src/game/GameSlot";
import { User } from "../../model/src/User/User";
import MovementOrder from "../../model/src/movement/MovementOrder";
import { MOVEMENT_TYPE } from "../../model/src/movement";
import Caliope from "../../model/src/unit/ships/protectorate/Caliope";
import Offset from "../../model/src/hexagon/Offset";
import Fulcrum from "../../model/src/unit/ships/protectorate/Fulcrum";
import { GAME_STATUS } from "../../model/src/game/gameStatus";
import { GAME_PHASE } from "../../model/src/game/gamePhase";
import { USER_AI } from "../../model/src/User/AIUser";
import { Constantin } from "../../model/src/unit/ships/federation";

class CreateTestGameHandler {
  initializeShip(
    serverShip: Ship,
    name: string,
    gameData: GameData,
    slot: GameSlot,
    user: User,
    position: Offset
  ) {
    serverShip.name = name;
    serverShip.id = uuidv4();
    serverShip.slotId = slot.id;
    serverShip.gameId = gameData.id;
    serverShip.getPlayer().setUser(user);

    const startMove = new MovementOrder(
      uuidv4(),
      MOVEMENT_TYPE.START,
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
        MOVEMENT_TYPE.DEPLOY,
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

  createTestShips(
    serverGameData: GameData,
    { useAI = false }: { useAI?: boolean }
  ) {
    const user1 = new User({ id: 1, username: "player1", accessLevel: 1 });
    const user2 = useAI
      ? USER_AI
      : new User({ id: 2, username: "player2", accessLevel: 1 });

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
      new Constantin(),
      "Test Constantin A1",
      serverGameData,
      slot1,
      user1,
      new Offset(60, -3)
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

    this.initializeShip(
      new Constantin(),
      "Test Constantin B1",
      serverGameData,
      slot2,
      user2,
      new Offset(-60, -3)
    );

    serverGameData.setStatus(GAME_STATUS.ACTIVE);
    serverGameData.setPhase(GAME_PHASE.GAME);
    serverGameData.ships.setShipLoadouts();

    return serverGameData;
  }

  createTestGame({ useAI = false }) {
    const user1 = new User({ id: 1, username: "player1", accessLevel: 1 });
    const user2 = useAI
      ? USER_AI
      : new User({ id: 2, username: "player2", accessLevel: 1 });

    const serverGamedata = new GameData();

    serverGamedata.name = "Test game";
    serverGamedata.creatorId = user1.id;

    serverGamedata.slots.addSlot(
      new GameSlot(
        {
          name: "Great Expanse Protectorate",
          team: 1,
          points: 3000,
          userId: user1.id,
          deploymentLocation: new Offset(30, 0),
          deploymentVector: new Offset(-10, 0),
          facing: 3,
        },
        serverGamedata
      )
    );

    serverGamedata.slots.addSlot(
      new GameSlot(
        {
          name: "United Colonies",
          team: 2,
          points: 3000,
          userId: user2.id,
          deploymentLocation: new Offset(-30, 0),
          deploymentVector: new Offset(10, 0),
          facing: 0,
        },
        serverGamedata
      )
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
