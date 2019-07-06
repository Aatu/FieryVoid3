import { InvalidGameDataError } from "../errors";
import {
  createShipObject,
  createBareShipObject
} from "../../model/unit/createShipObject.mjs";
import * as gameStatuses from "../../model/game/gameStatuses.mjs";
import * as gamePhases from "../../model/game/gamePhases.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import MovementTypes from "../../model/movement/MovementTypes.mjs";
import uuidv4 from "uuid/v4";

class BuyShipsHandler {
  buyShips(gameData, slotId, ships, user) {
    if (gameData.status !== gameStatuses.LOBBY) {
      throw new InvalidGameDataError(
        "Can not buy ships if game status is not 'lobby'"
      );
    }

    const slot = gameData.slots.getSlotById(slotId);
    ships = ships.map(createShipObject);

    if (!slot) {
      throw new InvalidGameDataError(`Slot not found with index ${slotId}`);
    }

    if (!slot.isOccupiedBy(user)) {
      throw new InvalidGameDataError("Slot taken by other user");
    }

    if (slot.isBought()) {
      throw new InvalidGameDataError("Slot already bought");
    }

    const totalCost = ships.reduce((acc, ship) => acc + ship.getPointCost(), 0);

    if (totalCost > slot.points) {
      throw new InvalidGameDataError(
        `Ships cost ${totalCost} points, but slot has only ${
          slot.points
        } points`
      );
    }

    ships.forEach(ship => this.initializeShip(ship, gameData, slot, user));

    slot.setBought();

    if (
      gameData.slots
        .getSlots()
        .every(slot => !slot.isOccupiedBy(user) || slot.isBought())
    ) {
      gameData.setPlayerInactive(user);
    }

    if (gameData.slots.getSlots().every(slot => slot.isBought())) {
      this.advance(gameData);
    }
  }

  initializeShip(ship, gameData, slot, user) {
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

  getDeployMove(startMove) {
    return new MovementOrder(
      uuidv4(),
      MovementTypes.DEPLOY,
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

  getStartPosition(gameData, slot) {
    let position = null;

    while (!position) {
      position = slot.deploymentLocation
        .spiral(slot.deploymentRadius)
        .find(pos =>
          gameData.ships.getShips().every(ship => {
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
      MovementTypes.START,
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

  advance(gameData) {
    gameData.players.forEach(player => gameData.setPlayerActive(player));
    gameData.setStatus(gameStatuses.ACTIVE);
    gameData.setPhase(gamePhases.DEPLOYMENT);
  }
}

export default BuyShipsHandler;
