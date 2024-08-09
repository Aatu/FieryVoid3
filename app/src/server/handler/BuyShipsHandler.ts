import GameData from "../../model/src/game/GameData";
import { GAME_PHASE } from "../../model/src/game/gamePhase";
import GameSlot from "../../model/src/game/GameSlot";
import { GAME_STATUS } from "../../model/src/game/gameStatus";
import { MOVEMENT_TYPE } from "../../model/src/movement";
import MovementOrder from "../../model/src/movement/MovementOrder";
import {
  createBareShipObject,
  createShipObject,
} from "../../model/src/unit/createShipObject";
import Ship, { SerializedShip } from "../../model/src/unit/Ship";
import { User } from "../../model/src/User/User";
import { InvalidGameDataError } from "../errors/index";
import { v4 as uuidv4 } from "uuid";

class BuyShipsHandler {
  buyShips(
    gameData: GameData,
    slotId: string,
    ships: SerializedShip[],
    user: User
  ) {
    if (gameData.status !== GAME_STATUS.LOBBY) {
      throw new InvalidGameDataError(
        "Can not buy ships if game status is not 'lobby'"
      );
    }

    const slot = gameData.slots.getSlotById(slotId);
    const shipInstances = ships.map(createShipObject);

    if (!slot) {
      throw new InvalidGameDataError(`Slot not found with index ${slotId}`);
    }

    if (!slot.isOccupiedBy(user)) {
      throw new InvalidGameDataError("Slot taken by other user");
    }

    if (slot.isBought()) {
      throw new InvalidGameDataError("Slot already bought");
    }

    const totalCost = shipInstances.reduce(
      (acc, ship) => acc + ship.getPointCost(),
      0
    );

    if (totalCost > slot.points) {
      throw new InvalidGameDataError(
        `Ships cost ${totalCost} points, but slot has only ${slot.points} points`
      );
    }

    shipInstances.forEach((ship) =>
      this.initializeShip(ship, gameData, slot, user)
    );

    slot.setBought();

    if (
      gameData.slots
        .getSlots()
        .every((slot) => !slot.isOccupiedBy(user) || slot.isBought())
    ) {
      gameData.setPlayerInactive(user);
    }

    if (gameData.slots.getSlots().every((slot) => slot.isBought())) {
      this.advance(gameData);
    }
  }

  initializeShip(ship: Ship, gameData: GameData, slot: GameSlot, user: User) {
    const serverShip = createBareShipObject(ship.serialize());
    serverShip.name = ship.name;
    serverShip.id = uuidv4();
    serverShip.slotId = slot.id;
    serverShip.gameId = gameData.id;
    serverShip.player.setUser(user);

    const startPosition = this.getStartPosition(gameData, slot);
    serverShip.movement.addMovement(startPosition);

    slot.addShip(serverShip);
    gameData.ships.addShip(serverShip);
    gameData.setActiveShip(serverShip);

    if (
      slot.isValidShipDeployment(serverShip, startPosition.getHexPosition())
    ) {
      serverShip.movement.addMovement(this.getDeployMove(startPosition));
    }
  }

  getDeployMove(startMove: MovementOrder) {
    return new MovementOrder(
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
    );
  }

  getStartPosition(gameData: GameData, slot: GameSlot) {
    let position = null;

    while (!position) {
      position = slot.deploymentLocation
        .spiral(slot.deploymentRadius)
        .find((pos) =>
          gameData.ships.getShips().every((ship) => {
            const shipPos = ship.getHexPosition();
            return !shipPos || !shipPos.equals(pos);
          })
        );

      if (!position) {
        slot.deploymentRadius++;
      }
    }

    return new MovementOrder(
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
  }

  advance(gameData: GameData) {
    gameData.players.forEach((player) => gameData.setPlayerActive(player));
    gameData.setStatus(GAME_STATUS.ACTIVE);
    gameData.setPhase(GAME_PHASE.DEPLOYMENT);
    gameData.ships.setShipLoadouts();
  }
}

export default BuyShipsHandler;
