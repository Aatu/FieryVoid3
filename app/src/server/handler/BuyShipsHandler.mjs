import { InvalidGameDataError } from "../errors";
import Ship from "../../model/unit/Ship.mjs";
import createShipObject from "../../model/unit/createShipObject.mjs";

class BuyShipsHandler {
  buyShips(gameData, slotId, ships, user) {
    const slot = gameData.slots.getSlotById(slotId);
    ships = ships.map(createShipObject);

    if (!slot) {
      throw new InvalidGameDataError(`Slot not found with index ${slotId}`);
    }

    if (slot.userId !== user.id) {
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
      ship.slotId = slot.id;
      ship.gameId = gameData.id;
      ship.player.setUser(user);
      gameData.ships.addShip(ship);
    });
  }
}

export default BuyShipsHandler;
