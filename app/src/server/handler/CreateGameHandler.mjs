import GameData from "../../model/game/GameData.mjs";
import * as gameStatuses from "../../model/game/gameStatuses.mjs";
import { InvalidGameDataError, UnauthorizedError } from "../errors";
import Sun from "../../model/terrain/Sun";
import uuidv4 from "uuid/v4";

class CreateGameHandler {
  createGame(clientGameData, user) {
    if (!user) {
      throw new UnauthorizedError("Not logged in");
    }

    const error = clientGameData.validateForGameCreate(user);
    if (error) {
      throw new InvalidGameDataError(error);
    }

    const serverGamedata = new GameData();
    serverGamedata.name = clientGameData.name;
    serverGamedata.creatorId = user.id;
    serverGamedata.slots.setSlots(clientGameData.slots.getSlots());
    serverGamedata.addPlayer(user);
    serverGamedata.setPlayerActive(user);
    serverGamedata.terrain.addEntity(new Sun(uuidv4()));

    return serverGamedata;
  }

  removeGame(gameData, user) {
    if (gameData.status !== gameStatuses.LOBBY) {
      throw new InvalidGameDataError(
        "Can not remove game that is not in lobby"
      );
    }

    if (
      gameData.creatorId !== user.id &&
      !gameData.slots
        .getSlots()
        .every(slot => !slot.isTaken() || !slot.isOccupiedBy(user))
    ) {
      throw new InvalidGameDataError(
        "Only game creator or last player can remove game"
      );
    }

    gameData.setStatus(gameStatuses.ABANDONED);
  }

  takeSlot(gameData, slotId, user) {
    if (gameData.status !== gameStatuses.LOBBY) {
      throw new InvalidGameDataError("Game status is wrong");
    }

    const slot = gameData.slots.getSlotById(slotId);
    if (!slot) {
      throw new InvalidGameDataError(`Slot id ${slotId} does not exist`);
    }

    if (slot.isTaken()) {
      throw new InvalidGameDataError("Slot already taken");
    }

    slot.takeSlot(user);
    gameData.addPlayer(user);
    gameData.setPlayerActive(user);
  }

  leaveSlot(gameData, slotId, user) {
    if (gameData.status !== gameStatuses.LOBBY) {
      throw new InvalidGameDataError("Game status is wrong");
    }

    const slot = gameData.slots.getSlotById(slotId);
    if (!slot) {
      throw new InvalidGameDataError(`Slot id ${slotId} does not exist`);
    }

    if (!slot.isTaken()) {
      throw new InvalidGameDataError("Slot is untaken");
    }

    if (!slot.isOccupiedBy(user)) {
      throw new InvalidGameDataError("Slot is not occupied by user");
    }

    slot.leaveSlot(user);

    if (gameData.slots.getSlots().every(slot => !slot.isOccupiedBy(user))) {
      gameData.removePlayer(user);
      gameData.setPlayerInactive(user);
    }

    if (gameData.slots.getSlots().every(slot => !slot.isTaken())) {
      gameData.setStatus(gameStatuses.ABANDONED);
    }
  }
}

export default CreateGameHandler;
