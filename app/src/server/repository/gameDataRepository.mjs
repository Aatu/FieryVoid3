import GameData from "../../model/game/GameData.mjs";

const getFromSystems = (systems, key) =>
  [].concat.apply(
    [],
    systems[key].map(system => system[data])
  );

class GameDataRepository {
  constructor(db) {
    this.db = db;
  }

  async loadGame(id, turn = null) {
    let conn = null;
    try {
      conn = await this.db.getConnection();
      const gameData = await this.getGame(conn, id, turn);
      gameData.players = await this.getPlayersInGame(conn, id);

      if (!turn) {
        turn = gameData.turn;
      }

      const shipData = await this.getShipDataForGame(conn, id, turn);
      const movementData = await this.getMovementForGame(conn, id, turn);

      const ships = await this.getShipsForGame(conn, id);
      gameData.ships = ships.map(
        this.constructShip.bind(this, shipData, movementData)
      );
      await conn.end();

      return new GameData(gameData);
    } catch (error) {
      if (conn) {
        conn.end();
      }
      throw error;
    }
  }

  constructShip(shipData, movementData, ship) {
    ship.shipData = JSON.parse(
      shipData.find(data => data.shipId === ship.id).data
    );

    ship.movement = movementData
      .filter(data => data.shipId === ship.id)
      .map(data => JSON.parse(data.data));

    return ship;
  }

  async saveShip(conn, gameId, turn, ship) {
    await this.saveShipForGame(conn, gameId, ship);
    await this.saveShipData(conn, gameId, turn, ship);
    await this.saveShipMovement(conn, gameId, ship);
  }

  async saveGame(gameDatas, error) {
    gameDatas = [].concat(gameDatas);
    let conn = null;
    let gameId = null;

    try {
      conn = await this.db.getConnection();
      await conn.beginTransaction();

      await Promise.all(
        gameDatas.map(async gameData => {
          const serialized = gameData.serialize();
          gameId = await this.saveGameState(conn, serialized);
          serialized.id = gameId;
          await this.saveGameData(conn, serialized);

          await Promise.all(
            serialized.players.map(player =>
              this.savePlayerInGame(conn, gameId, player)
            )
          );

          await Promise.all(
            serialized.ships.map(ship =>
              this.saveShip(conn, gameId, gameData.turn, ship)
            )
          );
        })
      );

      await conn.commit();
      await conn.end();

      return gameId;
    } catch (error) {
      if (conn) {
        await conn.rollback();
        conn.end();
      }
      throw error;
    }
  }

  async getGame(conn, id, turn) {
    const response = (
      await this.db.query(
        conn,
        `SELECT
        id,
        name,
        turn,
        phase,
        active_ships as activeShips,
        creator_id as creatorId,
        status
      FROM game
      WHERE id = ?`,
        [id]
      )
    )[0];

    if (turn === null) {
      turn = response.turn;
    }
    response.data = await this.getGameData(conn, id, turn);
    response.activeShips = JSON.parse(response.activeShips);
    return response;
  }

  async saveGameState(conn, data) {
    const response = await this.db.query(
      conn,
      `INSERT INTO game (
        id,
        name,
        turn,
        phase,
        active_ships,
        creator_id,
        status
      ) VALUES (
          ?,?,?,?,?,?,?
      ) ON DUPLICATE KEY UPDATE
        name = ?,
        turn = ?,
        phase = ?,
        active_ships = ?,
        creator_id = ?,
        status = ?`,
      [
        data.id,
        data.name,
        data.turn,
        data.phase,
        JSON.stringify(data.activeShips),
        data.creatorId,
        data.status,

        data.name,
        data.turn,
        data.phase,
        JSON.stringify(data.activeShips),
        data.creatorId,
        data.status
      ]
    );

    return data.id || response.insertId;
  }

  async saveGameData(conn, data) {
    const response = await this.db.query(
      conn,
      `INSERT INTO game_data (
        game_id,
        turn,
        data
      ) VALUES (
          ?,?,?
      ) ON DUPLICATE KEY UPDATE
        data = ?`,
      [data.id, data.turn, JSON.stringify(data.data), JSON.stringify(data.data)]
    );

    return data.id || response.insertId;
  }

  async getGameData(conn, id, turn) {
    const response = (
      await this.db.query(
        conn,
        `SELECT
          data
        FROM game_data
        WHERE game_id = ?
          AND turn = ?`,
        [id, turn]
      )
    )[0];

    return JSON.parse(response.data);
  }

  async getShipsForGame(conn, id) {
    return this.db.query(
      conn,
      `SELECT 
        CAST(UuidFromBin(id) as CHAR) as id,
        user_id as userId,
        CAST(UuidFromBin(slot_id) as CHAR) as slotId,
        name,
        ship_class as shipClass
      FROM ship
      WHERE game_id = ?
      ORDER by name DESC`,
      [id]
    );
  }

  async saveShipForGame(conn, gameId, data) {
    return this.db.query(
      conn,
      `INSERT INTO ship (
        id,
        game_id,
        user_id,
        slot_id,
        name,
        ship_class
      ) VALUES (
        UuidToBin(?),?,?,UuidToBin(?),?,?
      ) ON DUPLICATE KEY UPDATE
        game_id = ?,
        user_id = ?,
        slot_id = UuidToBin(?),
        name = ?,
        ship_class = ?`,
      [
        data.id,
        gameId,
        data.shipData.player.id,
        data.slotId,
        data.name,
        data.shipClass,
        gameId,
        data.shipData.player.id,
        data.slotId,
        data.name,
        data.shipClass
      ]
    );
  }
  async getPlayersInGame(conn, gameId) {
    return this.db.query(
      conn,
      `SELECT 
        id,
        username,
        access_level as accessLevel 
      FROM user u
      JOIN game_player p on u.id = p.user_id
      WHERE p.game_id = ?`,
      [gameId]
    );
  }

  async savePlayerInGame(conn, gameId, player) {
    return this.db.query(
      conn,
      `INSERT INTO game_player (
        game_id,
        user_id
      ) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE last_activity = now()`,
      [gameId, player.id]
    );
  }

  async getMovementForGame(conn, id, turn) {
    return this.db.query(
      conn,
      `SELECT  
        CAST(UuidFromBin(ship_id) as CHAR) as shipId,
        data
      FROM ship_movement
      WHERE game_id = ? and turn = ?
      ORDER BY turn ASC, movement_index ASC`,
      [id, turn]
    );
  }

  async saveShipMovement(conn, gameId, ship) {
    if (ship.movement.length === 0) {
      return;
    }

    return conn.batch(
      `INSERT INTO ship_movement (
      id,
      game_id,
      ship_id,
      turn,
      movement_index,
      data
    ) VALUES (
      UuidToBin(?),?,UuidToBin(?),?,?,?
    ) ON DUPLICATE KEY UPDATE data = ?`,
      ship.movement.map(move => [
        move.id,
        gameId,
        ship.id,
        move.turn,
        move.index,
        JSON.stringify(move),
        JSON.stringify(move)
      ])
    );
  }

  async getShipDataForGame(conn, id, turn) {
    return this.db.query(
      conn,
      `SELECT 
        CAST(UuidFromBin(ship_id) as CHAR) as shipId,
        data
      FROM game_ship_data
      WHERE game_id = ? and turn = ?`,
      [id, turn]
    );
  }

  async saveShipData(conn, gameId, turn, data) {
    return (
      await this.db.query(
        conn,
        `INSERT INTO game_ship_data (
        game_id,
        ship_id,
        turn,
        data
      ) VALUES (
          ?,UuidToBin(?),?,?
      ) ON DUPLICATE KEY UPDATE
        data = ?`,
        [gameId, data.id, turn, data.shipData, data.shipData]
      )
    )[0];
  }
}

export default GameDataRepository;
