import GameData from "../../model/game/GameData.mjs";

const getFromSystems = (systems, key) =>
  [].concat.apply([], systems[key].map(system => system[data]));

class GameDataRepository {
  constructor(db) {
    this.db = db;
  }

  async loadGame(id, turn = null, phase = null) {
    let conn = null;
    try {
      conn = await this.db.getConnection();
      const gameData = await this.getGame(conn, id);

      await conn.end();

      return new GameData(gameData);
    } catch (error) {
      if (conn) {
        conn.end();
      }
      throw error;
    }
    /*
    const gameShips = await this.getShipsForGame(id);
    const movement = await this.getMovementForGame(id, turn, phase);
    const systemData = await this.getSystemData(id, turn, phase);
    const shipData = await this.getShipData(id, turn, phase);
    const fireData = await this.getFireForGame(id, turn, phase);

    gameData.ships = gameShips.map(ship =>
      this.constructShips(ship, movement, systemData, shipData, fireData)
    );
    */

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
    let conn = null;

    try {
      conn = await this.db.getConnection();
      await conn.beginTransaction();
      const serialized = gameData.serialize();
      const gameId = await this.saveGameData(conn, serialized);

      await Promise.all(
        serialized.ships.map(ship => {
          console.log("save ship");
          return this.saveShipsForGame(conn, gameId, ship);
        })
      );

      await conn.commit();
      await conn.end();

      return gameId;

      console.log("ships");
      await this.saveMovementForGame(
        conn,
        serialized.id,
        serialized.turn,
        [].concat.apply([], serialized.ships.map(ship => ship.movement))
      );

      await this.saveFireForGame(
        conn,
        serialized.id,
        serialized.turn,
        [].concat.apply([], serialized.ships.map(ship => ship.fire))
      );

      await this.saveSystemData(
        conn,
        serialized.id,
        serialized.turn,
        serialized.phase,
        getFromSystems(
          [].concat.apply([], serialized.ships.map(ship => ship.systems)),
          "data"
        )
      );

      await this.saveShipData(
        conn,
        serialized.id,
        serialized.turn,
        serialized.phase,
        [].concat.apply([], serialized.ships.map(ship => ship.data))
      );

      conn.commit();

      return gameId;
    } catch (error) {
      if (conn) {
        await conn.rollback();
        conn.end();
      }
      throw error;
    }
  }

  async getGame(conn, id) {
    const response = (await this.db.query(
      conn,
      `SELECT
        id,
        name,
        turn,
        phase,
        active_ships as activeShips,
        data,
        creator_id as creatorId,
        status
      FROM game
      WHERE id = ?`,
      [id]
    ))[0];

    response.data = JSON.parse(response.data);
    return response;
  }

  async saveGameData(conn, data) {
    const response = await this.db.query(
      conn,
      `INSERT INTO game (
        id,
        name,
        turn,
        phase,
        active_ships,
        data,
        creator_id ,
        status
      ) VALUES (
          ?,?,?,?,?,?,?,?
      ) ON DUPLICATE KEY UPDATE
        name = ?,
        turn = ?,
        phase = ?,
        active_ships = ?,
        data = ?,
        creator_id = ?,
        status = ?`,
      [
        data.id,
        data.name,
        data.turn,
        data.phase,
        data.activeShips,
        data.data,
        data.creatorId,
        data.status,

        data.name,
        data.turn,
        data.phase,
        data.activeShips,
        data.data,
        data.creatorId,
        data.status
      ]
    );

    return data.id || response.insertId;
  }

  async getShipsForGame(conn, id) {
    return (await this.db.query(
      conn,
      `SELECT 
        id,
        user_id as userId,
        name,
        ship_class,
      FROM ship
      WHERE game_id = ?`,
      [id]
    ))[0];
  }

  async saveShipsForGame(conn, gameId, data) {
    const response = await this.db.query(
      conn,
      `INSERT INTO ship (
        id,
        game_id,
        user_id,
        slot_id,
        name,
        ship_class
      ) VALUES (
        ?,?,?,?,?,?
      ) ON DUPLICATE KEY UPDATE
        game_id = ?,
        user_id = ?,
        slot_id = ?,
        name = ?,
        ship_class = ?`,
      [
        data.id,
        gameId,
        data.player.id,
        data.slotId,
        data.name,
        data.shipClass,
        gameId,
        data.player.id,
        data.slotId,
        data.name,
        data.shipClass
      ]
    );

    if (response.insertId) {
      data.id = response.insertId;
    }
  }

  async getMovementForGame(conn, id, turn) {
    return (await this.db.query(
      conn,
      `SELECT 
        id,
        ship_id as shipId,
        turn,
        data,
      FROM ship_movement
      WHERE game_id = ? and turn = ?`,
      [id, turn]
    ))[0];
  }

  async saveMovementForGame(conn, gameId, data) {
    return (await this.db.query(
      conn,
      `INSERT INTO ship_movement (
        id,
        game_id
        ship_id,
        turn,
        data,
      ) VALUES (
          ?,?,?,?,?
      ) ON DUPLICATE KEY UPDATE
        ship_id = ?,
        turn = ?,
        data = ?`,
      [
        data.id,
        gameId,
        data.shipId,
        data.turn,
        data.data,

        data.shipId,
        data.turn,
        data.data
      ]
    ))[0];
  }

  async getFireForGame(conn, id, turn) {
    return (await this.db.query(
      `SELECT 
      id,
      type,
      ship_id as shipId,
      target_id as targetId,
      weapon_id as weaponId,
      target_system_id as targetSystemId,
      turn,
      data,
  FROM ship_fire
  WHERE game_id = ? and turn = ?`,
      [id, turn]
    ))[0];
  }

  async saveFireForGame(conn, gameId, data) {
    return (await this.db.query(
      `INSERT INTO ship_fire (
      id,
      game_id,
      type,
      ship_id,
      target_id,
      weapon_id,
      target_system_id,
      turn,
      data,
  ) VALUES (
      ?,?,?,?,?,?,?,?,?
  ) ON DUPLICATE KEY UPDATE
      type = ?,
      ship_id = ?,
      target_id = ?,
      weapon_id = ?,
      target_system_id = ?,
      turn = ?,
      data = ?`,
      [
        data.id,
        gameId,
        data.type,
        data.shipId,
        data.targetId,
        data.weaponId,
        data.targetSystemId,
        data.turn,
        data.data,

        data.type,
        data.shipId,
        data.targetId,
        data.weaponId,
        data.targetSystemId,
        data.turn,
        data.data
      ]
    ))[0];
  }

  async getShipData(conn, id, turn, phase) {
    return (await this.db.query(
      conn,
      `SELECT 
      ship_id as shipId,
      data,
  FROM game_ship_data
  WHERE game_id = ? and turn = ? and phase = ?`,
      [id, turn, phase]
    ))[0];
  }

  async saveShipData(conn, gameId, turn, phase, data) {
    return (await this.db.query(
      conn,
      `INSERT INTO game_ship_data (
      game_id,
      ship_id,
      turn,
      phase,
      data
  ) VALUES (
      ?,?,?,?,?,?
  ) ON DUPLICATE KEY UPDATE
      data = ?`,
      [gameId, data.shipId, turn, phase, data.data, data.data]
    ))[0];
  }

  async getSystemData(conn, id, turn, phase) {
    return (await this.db.query(
      conn,
      `SELECT 
      ship_id as shipId,
      system_id as systemId,
      data,
  FROM game_ship_data
  WHERE game_id = ? and turn = ? and phase = ?`,
      [id, turn, phase]
    ))[0];
  }

  async saveSystemData(conn, gameId, turn, phase, data) {
    return (await this.db.query(
      conn,
      `INSERT INTO ship_fire (
      game_id,
      ship_id,
      system_id,
      turn,
      phase,
      data
  ) VALUES (
      ?,?,?,?,?,?
  ) ON DUPLICATE KEY UPDATE
      data = ?`,
      [gameId, data.shipId, data.systemId, turn, phase, data.data, data.data]
    ))[0];
  }
}

export default GameDataRepository;
