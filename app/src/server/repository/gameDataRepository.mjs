import query from "./query";

export const getGame = async id =>
  (await query(
    `SELECT 
        name,
        turn,
        phase,
        active_ships as activeShips,
        data,
        creator_id as creatorId,
        status,
    FROM game
    WHERE id = ?`,
    [id]
  ))[0];

export const saveGame = async data =>
  (await query(
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
  ))[0];

export const getShipsForGame = async id =>
  (await query(
    `SELECT 
        id,
        user_id as userId,
        name,
        ship_class,
    FROM ship
    WHERE game_id = ?`,
    [id]
  ))[0];

export const saveShipsForGame = async (gameId, data) =>
  (await query(
    `INSERT INTO ship (
        id,
        game_id,
        user_id,
        name,
        ship_class,
  ) VALUES (
        ?,?,?,?,?
  ) ON DUPLICATE KEY UPDATE
        user_id = ?,
        name = ?,
        ship_class = ?`,
    [
      data.id,
      gameId,
      data.userId,
      data.name,
      data.shipClass,

      data.userId,
      data.name,
      data.shipClass
    ]
  ))[0];

export const getMovementForGame = async (id, turn) =>
  (await query(
    `SELECT 
        id,
        ship_id as shipId,
        turn,
        data,
    FROM ship_movement
    WHERE game_id = ? and turn = ?`,
    [id, turn]
  ))[0];

export const saveMovementForGame = async (gameId, data) =>
  (await query(
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

export const getFireForGame = async (id, turn) =>
  (await query(
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

export const saveFireForGame = async (gameId, data) =>
  (await query(
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

export const getShipData = async (id, turn, phase) =>
  (await query(
    `SELECT 
        ship_id as shipId,
        data,
    FROM game_ship_data
    WHERE game_id = ? and turn = ? and phase = ?`,
    [id, turn, phase]
  ))[0];

export const saveShipData = async (gameId, turn, phase data) =>
  (await query(
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
    [
      gameId,
      data.shipId,
      turn,
      phase,
      data.data,

      data.data
    ]
  ))[0];

export const getSystemData = async (id, turn, phase) =>
  (await query(
    `SELECT 
        ship_id as shipId,
        system_id as systemId,
        data,
    FROM game_ship_data
    WHERE game_id = ? and turn = ? and phase = ?`,
    [id, turn, phase]
  ))[0];

export const saveSystemData = async (gameId, turn, phase data) =>
  (await query(
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
    [
      gameId,
      data.shipId,
      data.systemId,
      turn,
      phase,
      data.data,

      data.data
    ]
  ))[0];
