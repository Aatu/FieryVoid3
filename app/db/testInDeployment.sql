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

-- Dumping data for table fieryvoid.game: ~1 rows (approximately)
DELETE FROM `game`;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` (`id`, `name`, `turn`, `phase`, `active_ships`, `data`, `creator_id`, `status`) VALUES
	(1, 'Test game', 1, 'deployment', '["7bb53eed-2be4-47a1-ba1a-f0c946feb84f","163f7ae9-00c8-4e6a-8118-778a75221e45","95f5b994-9d7a-463e-bb71-22016f41b65f","72ef6d63-39e2-42f7-86a6-dcfb182ca17b"]', '{"activePlayerIds":[1,2],"slots":[{"id":"2fcb10e4-b80c-48e9-b668-5cfc6756d886","name":"Blue","userId":1,"deploymentLocation":{"q":-30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":["7bb53eed-2be4-47a1-ba1a-f0c946feb84f","163f7ae9-00c8-4e6a-8118-778a75221e45"],"team":1,"bought":true,"facing":0},{"id":"19d2a9b7-a5a1-4e67-b056-9b1cd67b5e46","name":"Red","userId":2,"deploymentLocation":{"q":30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":["95f5b994-9d7a-463e-bb71-22016f41b65f","72ef6d63-39e2-42f7-86a6-dcfb182ca17b"],"team":2,"bought":true,"facing":0}],"terrain":[]}', 1, 'active');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_active_player: ~0 rows (approximately)
DELETE FROM `game_active_player`;
/*!40000 ALTER TABLE `game_active_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_active_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_event: ~0 rows (approximately)
DELETE FROM `game_event`;
/*!40000 ALTER TABLE `game_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_event` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_player: ~2 rows (approximately)
DELETE FROM `game_player`;
/*!40000 ALTER TABLE `game_player` DISABLE KEYS */;
INSERT INTO `game_player` (`game_id`, `user_id`, `last_activity`) VALUES
	(1, 1, '2019-07-07 00:29:32'),
	(1, 2, '2019-07-07 00:29:32');
/*!40000 ALTER TABLE `game_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_ship_data: ~8 rows (approximately)
DELETE FROM `game_ship_data`;
/*!40000 ALTER TABLE `game_ship_data` DISABLE KEYS */;
INSERT INTO `game_ship_data` (`game_id`, `ship_id`, `turn`, `phase`, `data`) VALUES
	(1, _binary 0x42F739E272EF6D6386A6DCFB182CA17B, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x463E9D7A95F5B994BB7122016F41B65F, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x47A12BE47BB53EEDBA1AF0C946FEB84F, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(1, _binary 0x4E6A00C8163F7AE98118778A75221E45, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}');
/*!40000 ALTER TABLE `game_ship_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_system_data: ~0 rows (approximately)
DELETE FROM `game_system_data`;
/*!40000 ALTER TABLE `game_system_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_system_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship: ~4 rows (approximately)
DELETE FROM `ship`;
/*!40000 ALTER TABLE `ship` DISABLE KEYS */;
INSERT INTO `ship` (`id`, `user_id`, `game_id`, `slot_id`, `name`, `ship_class`) VALUES
	(_binary 0x42F739E272EF6D6386A6DCFB182CA17B, 2, 1, _binary 0x4E67A5A119D2A9B7B0569B1CD67B5E46, 'Unnamed ship ', 'Fulcrum'),
	(_binary 0x463E9D7A95F5B994BB7122016F41B65F, 2, 1, _binary 0x4E67A5A119D2A9B7B0569B1CD67B5E46, 'Unnamed ship ', 'Mouros'),
	(_binary 0x47A12BE47BB53EEDBA1AF0C946FEB84F, 1, 1, _binary 0x48E9B80C2FCB10E4B6685CFC6756D886, 'Unnamed ship ', 'Fulcrum'),
	(_binary 0x4E6A00C8163F7AE98118778A75221E45, 1, 1, _binary 0x48E9B80C2FCB10E4B6685CFC6756D886, 'Unnamed ship ', 'Mouros');
/*!40000 ALTER TABLE `ship` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship_movement: ~8 rows (approximately)
DELETE FROM `ship_movement`;
/*!40000 ALTER TABLE `ship_movement` DISABLE KEYS */;
INSERT INTO `ship_movement` (`id`, `ship_id`, `game_id`, `turn`, `movement_index`, `data`) VALUES
	(_binary 0x4125CFC3F013F61995154DD301760698, _binary 0x4E6A00C8163F7AE98118778A75221E45, 1, 1, 1, '{"id":"f013f619-cfc3-4125-9515-4dd301760698","type":"deploy","position":{"x":-1320.6887407712688,"y":37.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x441BB16271E50156B1A72882DA5B281F, _binary 0x4E6A00C8163F7AE98118778A75221E45, 1, 1, 0, '{"id":"71e50156-b162-441b-b1a7-2882da5b281f","type":"start","position":{"x":-1320.6887407712688,"y":37.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":0}'),
	(_binary 0x4462019F427694D3A74A7CB32DB47EB9, _binary 0x47A12BE47BB53EEDBA1AF0C946FEB84F, 1, 1, 0, '{"id":"427694d3-019f-4462-a74a-7cb32db47eb9","type":"start","position":{"x":-1299.038105676658,"y":0,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":0}'),
	(_binary 0x47A06FE6EC4EF992BDD7D413F2E5CE0B, _binary 0x42F739E272EF6D6386A6DCFB182CA17B, 1, 1, 1, '{"id":"ec4ef992-6fe6-47a0-bdd7-d413f2e5ce0b","type":"deploy","position":{"x":1277.387470582047,"y":37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4BB0780970F2071FA82DFC2A21A7AC22, _binary 0x463E9D7A95F5B994BB7122016F41B65F, 1, 1, 1, '{"id":"70f2071f-7809-4bb0-a82d-fc2a21a7ac22","type":"deploy","position":{"x":1299.038105676658,"y":0,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4BB16BB37CB33CB89932F6F45464AA3B, _binary 0x42F739E272EF6D6386A6DCFB182CA17B, 1, 1, 0, '{"id":"7cb33cb8-6bb3-4bb1-9932-f6f45464aa3b","type":"start","position":{"x":1277.387470582047,"y":37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":0}'),
	(_binary 0x4EC176392FD6E14B996B4C21CB935734, _binary 0x463E9D7A95F5B994BB7122016F41B65F, 1, 1, 0, '{"id":"2fd6e14b-7639-4ec1-996b-4c21cb935734","type":"start","position":{"x":1299.038105676658,"y":0,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":0}'),
	(_binary 0x4F9FDA0CF43479B2916E8046D5AF238E, _binary 0x47A12BE47BB53EEDBA1AF0C946FEB84F, 1, 1, 1, '{"id":"f43479b2-da0c-4f9f-916e-8046d5af238e","type":"deploy","position":{"x":-1299.038105676658,"y":0,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}');
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
