import * as gameDataRepository from "../repository/userRepository";
import createShipObject from "../../model/unit/createShipObject";
import GameData from "../../model/game/GameData.mjs";

const getFromSystems = (systems, key) =>
  [].concat.apply([], systems[key].map(system => system[data]));

class GameDataService {
  constructor() {}

  test() {
    const game = new GameData();
    game.ships.addShip(createShipObject({ shipClass: "UcRhino" }));
    console.log(game.serialize());
  }

  async getGame(id, turn = null, phase = null) {
    const gameData = await gameDataRepository.getGame(id);
    const gameShips = await gameDataRepository.getShipsForGame(id);
    const movement = await gameDataRepository.getMovementForGame(
      id,
      turn,
      phase
    );
    const systemData = await gameDataRepository.getSystemData(id, turn, phase);
    const shipData = await gameDataRepository.getShipData(id, turn, phase);
    const fireData = await gameDataRepository.getFireForGame(id, turn, phase);

    gameData.ships = gameShips.map(ship =>
      this.constructShips(ship, movement, systemData, shipData, fireData)
    );

    return new GameData(gameData);
  }

  constructShips(ship, movementData, systemData, shipData, fireData) {
    const shipId = ship.id;
    ship.movement = movementData.find(data => data.shipId === shipId);
    ship.systems = systemData.find(data => data.shipId === shipId);
    ship.data = shipData.find(data => data.shipId === shipId);
    ship.fire = fireData.find(data => data.shipId === shipId);

    return createShipObject(ship);
  }

  async saveGame(gameData) {
    const serialized = gameData.serialize();
    await gameDataRepository.save(serialized);
    await gameDataRepository.saveShips(serialized.id, serialized.ships);
    await gameDataRepository.saveMovementForGame(
      serialized.id,
      serialized.turn,
      [].concat.apply([], serialized.ships.map(ship => ship.movement))
    );

    await gameDataRepository.saveFireForGame(
      serialized.id,
      serialized.turn,
      [].concat.apply([], serialized.ships.map(ship => ship.fire))
    );

    await gameDataRepository.saveSystemData(
      serialized.id,
      serialized.turn,
      serialized.phase,
      getFromSystems(
        [].concat.apply([], serialized.ships.map(ship => ship.systems)),
        "data"
      )
    );

    await gameDataRepository.saveShipData(
      serialized.id,
      serialized.turn,
      serialized.phase,
      [].concat.apply([], serialized.ships.map(ship => ship.data))
    );
  }
}

export default GameDataService;
