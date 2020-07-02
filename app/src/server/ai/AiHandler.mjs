import DestroyerAIRole from "./aiRoles/DestroyerAIRole.mjs";

class AiHandler {
  playAiTurn(gameHandler, gameData) {
    const clientGameData = gameData.clone();

    const aiShips = clientGameData.ships
      .getShips()
      .filter((ship) => ship.player.isAi());

    aiShips.forEach(this.ensureAiRole);

    aiShips.forEach((ship) => ship.aiRole.playTurn(clientGameData));

    clientGameData.getAiUsers().forEach((aiUser) => {
      try {
        gameHandler.submit(gameData, clientGameData, aiUser);
      } catch (e) {
        console.log("AI error");
        console.log(e);
      }
    });
  }

  ensureAiRole(ship) {
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
