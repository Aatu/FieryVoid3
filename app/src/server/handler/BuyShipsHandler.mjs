import { InvalidGameDataError } from "../errors";
import createShipObject from "../../model/unit/createShipObject.mjs";
import uuidv4 from "uuid/v4";

class BuyShipsHandler {
  buyShips(gameData, slotId, ships, user) {
    const slot = gameData.slots.getSlotById(slotId);
    ships = ships.map(createShipObject);

    if (!slot) {
      throw new InvalidGameDataError(`Slot not found with index ${slotId}`);
    }

    if (!slot.isOccupiedBy(user)) {
      throw new InvalidGameDataError("Slot taken by other user");
    }

    const totalCost = ships.reduce((acc, ship) => acc + ship.getPointCost(), 0);

    if (totalCost > slot.points) {
      throw new InvalidGameDataError(
        `Ships cost ${totalCost} points, but slot has only ${
          slot.points
        } points`
      );
    }

    ships.forEach(ship => {
      ship.id = uuidv4();
      ship.slotId = slot.id;
      ship.gameId = gameData.id;
      ship.player.setUser(user);
      slot.addShip(ship);
      gameData.ships.addShip(ship);
    });

    slot.setBought();

    if (
      gameData.slots
        .getSlots()
        .every(slot => !slot.isOccupiedBy(user) || slot.isBought())
    ) {
      gameData.setPlayerInactive(user);
    }
  }
}

export default BuyShipsHandler;
