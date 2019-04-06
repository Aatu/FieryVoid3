
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(400) NOT NULL,
  `access_level` int(11) NOT NULL DEFAULT '1',
  CONSTRAINT `username_unique` UNIQUE (`password`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `fire_order`;
CREATE TABLE `fire_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL DEFAULT 'normal',
  `ship_id` int(11) NOT NULL DEFAULT '0',
  `target_id` int(11) NOT NULL DEFAULT '0',
  `weapon_id` int(11) NOT NULL DEFAULT '0',
  `target_system_id` int(11) DEFAULT NULL,
  `turn` int(11) NOT NULL DEFAULT '0',
  `payload` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`payload`)),
  PRIMARY KEY (`id`),
  KEY (`game_id`),
  KEY (`ship_id`),
  KEY (`weapon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `turn` int(11) DEFAULT NULL,
  `phase` int(11) DEFAULT NULL,
  `active_ship` JSON DEFAULT '[]',
  `settings` JSON DEFAULT '{}',
  `creator_id` int(11) DEFAULT NULL,
  `status` ENUM('lobby','active','finished') DEFAULT 'lobby',
  CHECK (JSON_VALID(`settings`)),
  CHECK (JSON_VALID(`active_ship`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_active_player`;
CREATE TABLE `game` (
  `game_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  PRIMARY KEY (`game_id`, `player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_player`;
CREATE TABLE `game_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ship`;
CREATE TABLE `ship` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `ship_class` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ship_movement`;
CREATE TABLE `ship_movement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL DEFAULT '0',
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_ship_data`;
CREATE TABLE `game_ship_data` (
  `game_id` int(11) NOT NULL,
  `ship_id` int(11) NOT NULL,
  `turn` int(11) NOT NULL,
  `phase` int(11) NOT NULL,
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`game_id`,`turn`,`ship_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `game_system_data`;
CREATE TABLE `game_system_data` (
  `game_id` int(11) NOT NULL,
  `ship_id` int(11) NOT NULL,
  `system_id` int(11) NOT NULL,
  `turn` int(11) NOT NULL,
  `phase` int(11) NOT NULL,
  `data` JSON DEFAULT '{}',
  CHECK (JSON_VALID(`data`)),
  PRIMARY KEY (`game_id`,`turn`,`ship_id`, `system_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
