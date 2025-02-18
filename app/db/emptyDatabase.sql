

DELIMITER ;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(400) NOT NULL,
  `access_level` int(11) NOT NULL DEFAULT '1',
  CONSTRAINT `username_unique` UNIQUE (`username`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `game_data`;
CREATE TABLE `game_data` (
  `turn` int(11) DEFAULT NULL,
  `game_id` int(11) NOT NULL,
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`game_id`, `turn`),
  KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `turn` int(11) DEFAULT NULL,
  `phase` int(11) DEFAULT 0,
  `active_ships` JSON DEFAULT '[]',
  `creator_id` int(11) DEFAULT NULL,
  `status` ENUM('lobby','active','finished', 'abandoned') DEFAULT 'lobby',
  CHECK (JSON_VALID(`active_ships`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_active_player`;
CREATE TABLE `game_active_player` (
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`game_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_player`;
CREATE TABLE `game_player` (
  `game_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `last_activity` datetime DEFAULT NOW(),
  PRIMARY KEY (`game_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ship`;
CREATE TABLE `ship` (
  `id` UUID NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `slot_id` UUID NOT NULL,
  `name` varchar(200) NOT NULL,
  `ship_class` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ship_movement`;
CREATE TABLE `ship_movement` (
  `id` UUID NOT NULL,
  `ship_id` UUID NOT NULL,
  `game_id` int(11) NOT NULL,
  `turn` int (11) NOT NULL, 
  `movement_index` int (11) NOT NULL,
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_ship_data`;
CREATE TABLE `game_ship_data` (
  `game_id` int(11) NOT NULL,
  `ship_id` UUID NOT NULL,
  `turn` int(11) NOT NULL,
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`game_id`,`turn`,`ship_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `user` (username, password, access_level) VALUES ('player1', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1);
INSERT INTO `user` (username, password, access_level) VALUES ('player2', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1);
INSERT INTO `user` (id, username, password, access_level) VALUES (-1, 'AI opponent', '', 1);