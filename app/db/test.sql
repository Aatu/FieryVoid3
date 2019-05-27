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

-- Dumping data for table fieryvoid.game: ~2 rows (approximately)
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
REPLACE INTO `game` (`id`, `name`, `turn`, `phase`, `active_ships`, `data`, `creator_id`, `status`) VALUES
	(1, 'Test game', 1, 'deployment', '[]', '{"activePlayerIds":[1],"slots":[{"id":"a6509196-3072-4ea9-bd81-0bebd3f2ac82","name":"Blue","userId":1,"deploymentLocation":{"q":-30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":[],"team":1,"bought":false,"facing":0},{"id":"e2bdacdf-94fb-46c5-a74c-d15115b684c0","name":"Red","userId":null,"deploymentLocation":{"q":30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":[],"team":2,"bought":false,"facing":0}]}', 1, 'lobby'),
	(2, 'Test game', 1, 'deployment', '[]', '{"activePlayerIds":[2],"slots":[{"id":"d0226eae-b5ce-4160-ba59-34137a86ba5c","name":"Blue","userId":1,"deploymentLocation":{"q":-30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":["7fd91264-82de-4d32-9332-12609d0887b6","15c43164-2a9f-47c6-9cd3-8299525b8668"],"team":1,"bought":true,"facing":0},{"id":"06c81bad-c6e3-4eb4-9fe3-13ae9605aaf6","name":"Red","userId":2,"deploymentLocation":{"q":30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":[],"team":2,"bought":false,"facing":0}]}', 1, 'lobby');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_active_player: ~0 rows (approximately)
/*!40000 ALTER TABLE `game_active_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_active_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_event: ~0 rows (approximately)
/*!40000 ALTER TABLE `game_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_event` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_player: ~3 rows (approximately)
/*!40000 ALTER TABLE `game_player` DISABLE KEYS */;
REPLACE INTO `game_player` (`game_id`, `user_id`, `last_activity`) VALUES
	(1, 1, '2019-04-23 20:41:43'),
	(2, 1, '2019-04-28 17:08:42'),
	(2, 2, '2019-04-28 17:08:42');
/*!40000 ALTER TABLE `game_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_ship_data: ~2 rows (approximately)
/*!40000 ALTER TABLE `game_ship_data` DISABLE KEYS */;
REPLACE INTO `game_ship_data` (`game_id`, `ship_id`, `turn`, `phase`, `data`) VALUES
	(2, _binary 0x47C62A9F15C431649CD38299525B8668, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(2, _binary 0x4D3282DE7FD91264933212609D0887B6, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}');
/*!40000 ALTER TABLE `game_ship_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_system_data: ~0 rows (approximately)
/*!40000 ALTER TABLE `game_system_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_system_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship: ~2 rows (approximately)
/*!40000 ALTER TABLE `ship` DISABLE KEYS */;
REPLACE INTO `ship` (`id`, `user_id`, `game_id`, `slot_id`, `name`, `ship_class`) VALUES
	(_binary 0x47C62A9F15C431649CD38299525B8668, 1, 2, _binary 0x4160B5CED0226EAEBA5934137A86BA5C, 'Unnamed ship ', 'UcRhino'),
	(_binary 0x4D3282DE7FD91264933212609D0887B6, 1, 2, _binary 0x4160B5CED0226EAEBA5934137A86BA5C, 'Unnamed ship ', 'UcRhino');
/*!40000 ALTER TABLE `ship` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship_movement: ~2 rows (approximately)
/*!40000 ALTER TABLE `ship_movement` DISABLE KEYS */;
REPLACE INTO `ship_movement` (`id`, `ship_id`, `game_id`, `turn`, `data`) VALUES
	(_binary 0x44BC14E21D21C4B8AD661CE825AADD20, _binary 0x4D3282DE7FD91264933212609D0887B6, 2, 1, '{"id":"1d21c4b8-14e2-44bc-ad66-1ce825aadd20","type":"start","position":{"q":-30,"r":0},"target":{"q":10,"r":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x47DD4263756AB1AD98333C4B81DDDB37, _binary 0x47C62A9F15C431649CD38299525B8668, 2, 1, '{"id":"756ab1ad-4263-47dd-9833-3c4b81dddb37","type":"start","position":{"q":-30,"r":1},"target":{"q":10,"r":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}');
/*!40000 ALTER TABLE `ship_movement` ENABLE KEYS */;

-- Dumping data for table fieryvoid.user: ~2 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
REPLACE INTO `user` (`id`, `username`, `password`, `access_level`) VALUES
	(1, 'player1', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1),
	(2, 'player2', '*F6ECD1F80E1654CC7D3491B7C3FCBDE00A9C41DF', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
