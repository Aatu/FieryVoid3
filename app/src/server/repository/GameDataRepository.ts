import GameData, {
  SerializedGameData,
  SerializedGameDataSubData,
} from "../../model/src/game/GameData";
import { GAME_PHASE } from "../../model/src/game/gamePhase";
import { GAME_STATUS } from "../../model/src/game/gameStatus";
import { SerializedMovementOrder } from "../../model/src/movement/MovementOrder";
import Ship, {
  SerializedShip,
  ShipBase,
  ShipData,
} from "../../model/src/unit/Ship";
import { IUser, User } from "../../model/src/User/User";
import DbConnection from "./DbConnection";
import { PoolConnection as Connection } from "mariadb";

class GameDataRepository {
  private db: DbConnection;

  constructor(db: DbConnection) {
    this.db = db;
  }

  async loadGame(id: number, turn: number | null = null): Promise<GameData> {
    let conn = null;
    try {
      conn = await this.db.getConnection();
      const gameData = await this.getGame(conn, id, turn);
      const players = await this.getPlayersInGame(conn, id);

      if (!turn) {
        turn = gameData.turn || 0;
      }

      const shipData = await this.getShipDataForGame(conn, id, turn);
      const movementData = await this.getMovementForGame(conn, id, turn);

      const ships = (await this.getShipsForGame(conn, id)).map((ship) =>
        this.constructShip(shipData, movementData, ship, id)
      );
      await conn.end();

      return new GameData({ ...gameData, players, ships });
    } catch (error) {
      if (conn) {
        conn.end();
      }
      throw error;
    }
  }

  constructShip(
    shipData: { shipId: string; data: string }[],
    movementData: { shipId: string; data: string }[],
    ship: {
      id: string;
      userId: number;
      slotId: string;
      name: string;
      shipClass: string;
    },
    gameId: number
  ): SerializedShip {
    const thisShipData = shipData.find((data) => data.shipId === ship.id);

    if (!thisShipData) {
      throw new Error("Ship not found in data");
    }

    const newShipData = JSON.parse(thisShipData.data) as ShipData;
    const movement = movementData
      .filter((data) => data.shipId === ship.id)
      .map((data) => JSON.parse(data.data)) as SerializedMovementOrder[];

    return {
      ...ship,
      shipData: newShipData,
      movement,
      gameId,
    };
  }

  async saveShip(
    conn: Connection,
    gameId: number,
    turn: number,
    ship: SerializedShip
  ) {
    await this.saveShipForGame(conn, gameId, ship);
    await this.saveShipData(conn, gameId, turn, ship);
    await this.saveShipMovement(conn, gameId, ship);
  }

  async saveGame(gameDatas: GameData | GameData[]): Promise<number[]> {
    gameDatas = ([] as GameData[]).concat(gameDatas);
    let conn: Connection | null = null;
    let gameId: number | null = null;

    try {
      conn = await this.db.getConnection();
      await conn.beginTransaction();

      await Promise.all(
        gameDatas.map(async (gameData) => {
          const serialized = gameData.serialize();
          gameId = await this.saveGameState(conn, serialized);
          serialized.id = gameId;
          gameData.id = gameId;
          await this.saveGameData(conn, serialized);

          await Promise.all(
            serialized.players.map((player) =>
              this.savePlayerInGame(conn, gameId as number, player)
            )
          );

          await Promise.all(
            serialized.ships.map((ship) =>
              this.saveShip(
                conn as Connection,
                gameId as number,
                gameData.turn,
                ship
              )
            )
          );
        })
      );

      await conn.commit();
      await conn.end();

      return gameDatas.map((gameData) => gameData.id as number);
    } catch (error) {
      if (conn) {
        await conn.rollback();
        conn.end();
      }
      throw error;
    }
  }

  async getGame(conn: Connection | null, id: number, turn: number | null) {
    const response = (
      await this.db.query<{
        id: number;
        name: string;
        turn: number;
        phase: GAME_PHASE;
        activeShips: string;
        creatorId: number;
        status: GAME_STATUS;
      }>(
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
      turn = response.turn || 0;
    }

    return {
      ...response,
      data: await this.getGameData(conn, id, turn),
      activeShips: response.activeShips,
    };
  }

  async saveGameState(
    conn: Connection | null,
    data: SerializedGameData
  ): Promise<number> {
    console.log("inserting game, phase", data.phase);
    const insertId = await this.db.insert(
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
        data.id || null,
        data.name || "",
        data.turn || 0,
        data.phase || GAME_PHASE.DEPLOYMENT,
        JSON.stringify(data.activeShips),
        data.creatorId || -1,
        data.status || GAME_STATUS.LOBBY,

        data.name || "",
        data.turn || 0,
        data.phase || GAME_PHASE.DEPLOYMENT,
        JSON.stringify(data.activeShips),
        data.creatorId || -1,
        data.status || GAME_STATUS.LOBBY,
      ]
    );

    return data.id || insertId;
  }

  async saveGameData(conn: Connection | null, data: SerializedGameData) {
    const insertId = await this.db.insert(
      conn,
      `INSERT INTO game_data (
        game_id,
        turn,
        data
      ) VALUES (
          ?,?,?
      ) ON DUPLICATE KEY UPDATE
        data = ?`,
      [
        data.id || null,
        data.turn || 0,
        JSON.stringify(data.data),
        JSON.stringify(data.data),
      ]
    );

    return data.id || insertId;
  }

  async getGameData(
    conn: Connection | null,
    id: number,
    turn: number
  ): Promise<SerializedGameDataSubData> {
    const response = (
      await this.db.query<{ data: string }>(
        conn,
        `SELECT
          data
        FROM game_data
        WHERE game_id = ?
          AND turn = ?`,
        [id, turn]
      )
    )[0];

    return response.data as SerializedGameDataSubData;
  }

  async getShipsForGame(conn: Connection | null, id: number) {
    return this.db.query<{
      id: string;
      userId: number;
      slotId: string;
      name: string;
      shipClass: string;
    }>(
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

  async saveShipForGame(
    conn: Connection | null,
    gameId: number,
    data: SerializedShip
  ) {
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
        data.id || "",
        gameId,
        data?.shipData?.player?.id || -1,
        data.slotId || "",
        data.name || "",
        data.shipClass || "",
        gameId,
        data?.shipData?.player?.id || -1,
        data.slotId || "",
        data.name || "",
        data.shipClass || "",
      ]
    );
  }

  async getPlayersInGame(conn: Connection | null, gameId: number) {
    return this.db.query<{ id: number; username: string; accessLevel: number }>(
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

  async savePlayerInGame(
    conn: Connection | null,
    gameId: number,
    player: IUser
  ) {
    return this.db.insert(
      conn,
      `INSERT INTO game_player (
        game_id,
        user_id
      ) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE last_activity = now()`,
      [gameId, player.id]
    );
  }

  async getMovementForGame(conn: Connection | null, id: number, turn: number) {
    return this.db.query<{ shipId: string; data: string }>(
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

  async saveShipMovement(
    conn: Connection,
    gameId: number,
    ship: SerializedShip
  ) {
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
      ship.movement.map((move) => [
        move.id,
        gameId,
        ship.id,
        move.turn,
        move.index,
        JSON.stringify(move),
        JSON.stringify(move),
      ])
    );
  }

  async getShipDataForGame(conn: Connection | null, id: number, turn: number) {
    return this.db.query<{ shipId: string; data: string }>(
      conn,
      `SELECT 
        CAST(UuidFromBin(ship_id) as CHAR) as shipId,
        data
      FROM game_ship_data
      WHERE game_id = ? and turn = ?`,
      [id, turn]
    );
  }

  async saveShipData(
    conn: Connection | null,
    gameId: number,
    turn: number,
    data: SerializedShip
  ) {
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
        [gameId, data.id || "", turn, data.shipData || {}, data.shipData || {}]
      )
    )[0];
  }
}

export default GameDataRepository;
