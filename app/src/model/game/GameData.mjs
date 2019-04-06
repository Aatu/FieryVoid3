import GameSlots from "./GameSlots";
import GameShips from "./GameShips";
import GameActiveShips from "./GameActiveShips";

class GameData {
  constructor(data) {
    this.deserialize(data);
  }

  serialize() {
    return {
      id: this.id,
      phase: this.phase,
      turn: this.turn,
      data: {
        slots: this.slots.serialize()
      },
      ships: this.ships.serialize(),
      activeShips: this.activeShips.serialize(),
      creatorId: this.creatorId,
      status: this.status
    };
  }

  deserialize(data = {}) {
    const gameData = data.data || {};
    this.id = data.id || null;
    this.phase = data.phase || 0;
    this.turn = data.turn || 1;
    this.slots = new GameSlots(this).deserialize(gameData);
    this.ships = new GameShips(this).deserialize(data.ships);
    this.activeShips = new GameActiveShips(this).deserialize(data.activeShipa);
    this.creatorId = data.creatorId;
    this.status = data.status || "lobby";

    return this;
  }
}

export default GameData;
