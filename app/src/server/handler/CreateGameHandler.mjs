import GameData from "../../model/game/GameData.mjs";
import { InvalidGameDataError } from "../errors";

class CreateGameHandler {
  createGame(clientGameData, user) {
    const error = clientGameData.validateForGameCreate(user);
    if (error) {
      throw new InvalidGameDataError(error);
    }

    const serverGamedata = new GameData();
    serverGamedata.name = clientGameData.name;
    serverGamedata.creatorId = user.id;
    serverGamedata.slots.setSlots(clientGameData.slots.getSlots());

    return serverGamedata;
  }
}

export default CreateGameHandler;
