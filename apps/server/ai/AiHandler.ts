import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import GameHandler from "../handler/GameHandler";
import DestroyerAIRole from "./aiRoles/DestroyerAIRole";

class AiHandler {
  playAiTurn(gameHandler: GameHandler, gameData: GameData) {
    const clientGameData = gameData.clone();

    const aiShips = clientGameData.ships
      .getShips()
      .filter((ship) => ship.getPlayer().isAi());

    aiShips.forEach(this.ensureAiRole);

    aiShips.forEach((ship) => ship.getAIRole().playTurn(clientGameData));

    clientGameData.getAiUsers().forEach((aiUser) => {
      if (!aiUser) {
        return;
      }

      try {
        gameHandler.submit(gameData, clientGameData, aiUser);
      } catch (e) {
        console.log("AI error");
        console.log(e);
      }
    });
  }

  ensureAiRole(ship: Ship) {
    if (ship.aiRole === null) {
      ship.aiRole = new DestroyerAIRole(ship);
      return;
    }

    const data = ship.aiRole;

    switch (data.type) {
      case "DestroyerAIRole":
      default:
        ship.aiRole = new DestroyerAIRole(ship).deserialize(data);
        return;
    }
  }
}

export default AiHandler;
