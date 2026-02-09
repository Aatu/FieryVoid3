-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.3.14-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping data for table fieryvoid.game: ~0 rows (approximately)
DELETE FROM `game`;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` (`id`, `name`, `turn`, `phase`, `active_ships`, `creator_id`, `status`) VALUES
	(1, 'Test game', 1, 'game', '["498bdb10-3cde-4f40-a745-cc55292362ec","09376da2-8e24-4290-81d0-d6cb0abeefb9"]', 1, 'active');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_active_player: ~0 rows (approximately)
DELETE FROM `game_active_player`;
/*!40000 ALTER TABLE `game_active_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_active_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_data: ~0 rows (approximately)
DELETE FROM `game_data`;
/*!40000 ALTER TABLE `game_data` DISABLE KEYS */;
INSERT INTO `game_data` (`turn`, `game_id`, `data`) VALUES
	(1, 1, '{"activePlayerIds":[1,2],"slots":[{"id":"4ed6e711-ee23-4a47-8178-fa7717fea009","name":"Blue","userId":1,"deploymentLocation":{"q":-150,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":["498bdb10-3cde-4f40-a745-cc55292362ec"],"team":1,"bought":true,"facing":0},{"id":"f5643430-33b5-4e02-b320-6aceed5c89b1","name":"Red","userId":2,"deploymentLocation":{"q":150,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":["09376da2-8e24-4290-81d0-d6cb0abeefb9"],"team":2,"bought":true,"facing":0}],"terrain":[],"combatLog":{"entries":[]},"torpedos":{"flights":[]}}');
/*!40000 ALTER TABLE `game_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_event: ~0 rows (approximately)
DELETE FROM `game_event`;
/*!40000 ALTER TABLE `game_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_event` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_player: ~0 rows (approximately)
DELETE FROM `game_player`;
/*!40000 ALTER TABLE `game_player` DISABLE KEYS */;
INSERT INTO `game_player` (`game_id`, `user_id`, `last_activity`) VALUES
	(1, 1, '2019-12-25 17:17:55'),
	(1, 2, '2019-12-25 17:17:55');
/*!40000 ALTER TABLE `game_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_ship_data: ~0 rows (approximately)
DELETE FROM `game_ship_data`;
/*!40000 ALTER TABLE `game_ship_data` DISABLE KEYS */;
INSERT INTO `game_ship_data` (`game_id`, `ship_id`, `turn`, `data`) VALUES
	(1, _binary 0x42908E2409376DA281D0D6CB0ABEEFB9, 1, '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":103,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":104,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":111,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":12,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"electronicWarfareProvider":[]}},{"systemId":13,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":14,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":301,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":31,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":32,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":33,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":311,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":313,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":314,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":312,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":401,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":402,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"cargoBaySystemStrategy":[{"className":"Torpedo158MSV","amount":6},{"className":"Torpedo158Nuclear","amount":1},{"className":"Torpedo72MSV","amount":12}]}},{"systemId":403,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"torpedoLauncherStrategy1":{"turnsLoaded":3,"loadedTorpedo":"Torpedo158MSV","changeAmmo":null,"launchTarget":null}}},{"systemId":404,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"torpedoLauncherStrategy1":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null},"torpedoLauncherStrategy2":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":202,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"cargoBaySystemStrategy":[{"className":"Torpedo158MSV","amount":6},{"className":"Torpedo158Nuclear","amount":1},{"className":"Torpedo72MSV","amount":12}]}},{"systemId":203,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"torpedoLauncherStrategy1":{"turnsLoaded":3,"loadedTorpedo":"Torpedo158MSV","changeAmmo":null,"launchTarget":null}}},{"systemId":204,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"torpedoLauncherStrategy1":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null},"torpedoLauncherStrategy2":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null}}}],"player":{"id":2,"username":"player2","accessLevel":1},"electronicWarfare":{"dew":0,"ccew":0,"entries":[]}}'),
	(1, _binary 0x4F403CDE498BDB10A745CC55292362EC, 1, '{"systems":[{"systemId":100,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":102,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":3}}},{"systemId":103,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":104,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":105,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":106,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":107,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":108,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"torpedoLauncherStrategy1":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null},"torpedoLauncherStrategy2":{"turnsLoaded":3,"loadedTorpedo":"Torpedo72MSV","changeAmmo":null,"launchTarget":null}}},{"systemId":12,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"electronicWarfareProvider":[]}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":14,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":200,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":202,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":203,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":214,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":316,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":317,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"cargoBaySystemStrategy":[{"className":"Torpedo72MSV","amount":12}]}},{"systemId":15,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":215,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":216,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":13,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":213,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]},"fireOrderStrategy":[],"standardLoadingStrategy":{"turnsLoaded":1}}},{"systemId":416,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1},"electronicWarfare":{"dew":0,"ccew":0,"entries":[]}}');
/*!40000 ALTER TABLE `game_ship_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_system_data: ~0 rows (approximately)
DELETE FROM `game_system_data`;
/*!40000 ALTER TABLE `game_system_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_system_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship: ~0 rows (approximately)
DELETE FROM `ship`;
/*!40000 ALTER TABLE `ship` DISABLE KEYS */;
INSERT INTO `ship` (`id`, `user_id`, `game_id`, `slot_id`, `name`, `ship_class`) VALUES
	(_binary 0x42908E2409376DA281D0D6CB0ABEEFB9, 2, 1, _binary 0x4E0233B5F5643430B3206ACEED5C89B1, 'Unnamed ship ', 'Caliope'),
	(_binary 0x4F403CDE498BDB10A745CC55292362EC, 1, 1, _binary 0x4A47EE234ED6E7118178FA7717FEA009, 'Unnamed ship ', 'Fulcrum');
/*!40000 ALTER TABLE `ship` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship_movement: ~0 rows (approximately)
DELETE FROM `ship_movement`;
/*!40000 ALTER TABLE `ship_movement` DISABLE KEYS */;
INSERT INTO `ship_movement` (`id`, `ship_id`, `game_id`, `turn`, `movement_index`, `data`) VALUES
	(_binary 0x43C195DC16BA60F894E9CF1FD29C2BBD, _binary 0x42908E2409376DA281D0D6CB0ABEEFB9, 1, 1, 1, '{"id":"16ba60f8-95dc-43c1-94e9-cf1fd29c2bbd","type":"start","position":{"x":3247.5952641916447,"y":0,"z":0},"velocity":{"x":-216.50635094610965,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x48449B1634FC0A069387F05F6CC05CB4, _binary 0x4F403CDE498BDB10A745CC55292362EC, 1, 1, 1, '{"id":"34fc0a06-9b16-4844-9387-f05f6cc05cb4","type":"start","position":{"x":-3247.5952641916447,"y":0,"z":0},"velocity":{"x":216.50635094610965,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x49D25FAD9D062BAA8B05E5CBA7B7F99C, _binary 0x42908E2409376DA281D0D6CB0ABEEFB9, 1, 1, 2, '{"id":"9d062baa-5fad-49d2-8b05-e5cba7b7f99c","type":"deploy","position":{"x":3388.324392306616,"y":131.25,"z":0},"velocity":{"x":-216.50635094610965,"y":0,"z":0},"facing":3,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4EBB78F85D9E7863982BF44849A6CC69, _binary 0x4F403CDE498BDB10A745CC55292362EC, 1, 1, 2, '{"id":"5d9e7863-78f8-4ebb-982b-f44849a6cc69","type":"deploy","position":{"x":-3355.8484396646995,"y":150,"z":0},"velocity":{"x":216.50635094610965,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}');
/*!40000 ALTER TABLE `ship_movement` ENABLE KEYS */;

-- Dumping data for table fieryvoid.user: ~2 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `password`, `access_level`) VALUES
	(1, 'player1', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1),
	(2, 'player2', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
