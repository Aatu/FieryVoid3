export default dbName => `
DROP DATABASE IF EXISTS fieryvoidtest_${dbName};
CREATE DATABASE fieryvoidtest_${dbName};
USE fieryvoidtest_${dbName};

DROP FUNCTION IF EXISTS UuidToBin;
CREATE FUNCTION UuidToBin(_uuid BINARY(36))
    RETURNS BINARY(16)
    LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
RETURN
    UNHEX(CONCAT(
        SUBSTR(_uuid, 15, 4),
        SUBSTR(_uuid, 10, 4),
        SUBSTR(_uuid,  1, 8),
        SUBSTR(_uuid, 20, 4),
        SUBSTR(_uuid, 25) ));


DROP FUNCTION IF EXISTS UuidFromBin;
CREATE FUNCTION UuidFromBin(_bin BINARY(16))
    RETURNS BINARY(36)
    LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
RETURN
    LCASE(CONCAT_WS('-',
        HEX(SUBSTR(_bin,  5, 4)),
        HEX(SUBSTR(_bin,  3, 2)),
        HEX(SUBSTR(_bin,  1, 2)),
        HEX(SUBSTR(_bin,  9, 2)),
        HEX(SUBSTR(_bin, 11))
              ));

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(45) NOT NULL,
  password varchar(400) NOT NULL,
  access_level int(11) NOT NULL DEFAULT '1',
  CONSTRAINT username_unique UNIQUE(username),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS game_event;
CREATE TABLE game_event (
  id BINARY(16) NOT NULL,
  game_id int(11) NOT NULL,
  type varchar(45) NOT NULL DEFAULT 'normal',
  ship_id BINARY(16) NOT NULL,
  turn int(11) NOT NULL DEFAULT '0',
  data JSON DEFAULT '{}',
  CHECK (JSON_VALID(data)),
  PRIMARY KEY (id),
  KEY (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS game;
CREATE TABLE game (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  turn int(11) DEFAULT NULL,
  phase ENUM('deployment','game') DEFAULT 'deployment',
  active_ships JSON DEFAULT '[]',
  data JSON DEFAULT '{}',
  creator_id int(11) DEFAULT NULL,
  status ENUM('lobby','active','finished', 'abandoned') DEFAULT 'lobby',
  CHECK (JSON_VALID(data)),
  CHECK (JSON_VALID(active_ships)),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS game_active_player;
CREATE TABLE game_active_player (
  game_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  PRIMARY KEY (game_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS game_player;
CREATE TABLE game_player (
  game_id int(11) NOT NULL,
  user_id int(11) DEFAULT NULL,
  last_activity datetime DEFAULT NOW(),
  PRIMARY KEY (game_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS ship;
CREATE TABLE ship (
  id BINARY(16) NOT NULL,
  user_id int(11) NOT NULL,
  game_id int(11) NOT NULL,
  slot_id BINARY(16) NOT NULL,
  name varchar(200) NOT NULL,
  ship_class varchar(45) NOT NULL,
  PRIMARY KEY (id),
  KEY (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS ship_movement;
CREATE TABLE ship_movement (
  id BINARY(16) NOT NULL,
  ship_id BINARY(16) NOT NULL,
  game_id int(11) NOT NULL,
  turn int (11) NOT NULL,
  movement_index int (11) NOT NULL,
  data JSON DEFAULT '{}',
  CHECK (JSON_VALID(data)),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS game_ship_data;
CREATE TABLE game_ship_data (
  game_id int(11) NOT NULL,
  ship_id BINARY(16) NOT NULL,
  turn int(11) NOT NULL,
  data JSON DEFAULT '{}',
  CHECK (JSON_VALID(data)),
  PRIMARY KEY (game_id,turn,ship_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO USER (username, password, access_level) VALUES ('Nönmän', 'lol', 1);
INSERT INTO USER (username, password, access_level) VALUES ('Bädmän', 'lol', 1);
`;
