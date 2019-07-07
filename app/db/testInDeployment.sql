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
INSERT INTO `game` (`id`, `name`, `turn`, `phase`, `active_ships`, `data`, `creator_id`, `status`) VALUES
	(1, 'Test game', 1, 'deployment', '["008c9765-07a9-4946-82c9-6e69d85ec5b6","53cba8c2-aaf7-4e57-8532-df98895ae4a8","aff0069d-8014-461e-bbbc-03b5d2879e8c","f0a77fbf-c2d4-41a0-b819-cd8d1f6959db"]', '{"activePlayerIds":[1,2],"slots":[{"id":"4c590e73-ad36-43a9-a830-8cbbd4a02a58","name":"Blue","userId":1,"deploymentLocation":{"q":-30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":["008c9765-07a9-4946-82c9-6e69d85ec5b6","53cba8c2-aaf7-4e57-8532-df98895ae4a8"],"team":1,"bought":true,"facing":0},{"id":"230927e0-d199-429c-b62e-827d3ced1c54","name":"Red","userId":2,"deploymentLocation":{"q":30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":["aff0069d-8014-461e-bbbc-03b5d2879e8c","f0a77fbf-c2d4-41a0-b819-cd8d1f6959db"],"team":2,"bought":true,"facing":0}],"terrain":[]}', 1, 'active');
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
	(1, 1, '2019-07-07 01:46:16'),
	(1, 2, '2019-07-07 01:46:16');
/*!40000 ALTER TABLE `game_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_ship_data: ~8 rows (approximately)
DELETE FROM `game_ship_data`;
/*!40000 ALTER TABLE `game_ship_data` DISABLE KEYS */;
INSERT INTO `game_ship_data` (`game_id`, `ship_id`, `turn`, `phase`, `data`) VALUES
	(1, _binary 0x41A0C2D4F0A77FBFB819CD8D1F6959DB, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x461E8014AFF0069DBBBC03B5D2879E8C, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x494607A9008C976582C96E69D85EC5B6, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(1, _binary 0x4E57AAF753CBA8C28532DF98895AE4A8, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}');
/*!40000 ALTER TABLE `game_ship_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_system_data: ~0 rows (approximately)
DELETE FROM `game_system_data`;
/*!40000 ALTER TABLE `game_system_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_system_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship: ~4 rows (approximately)
DELETE FROM `ship`;
/*!40000 ALTER TABLE `ship` DISABLE KEYS */;
INSERT INTO `ship` (`id`, `user_id`, `game_id`, `slot_id`, `name`, `ship_class`) VALUES
	(_binary 0x41A0C2D4F0A77FBFB819CD8D1F6959DB, 2, 1, _binary 0x429CD199230927E0B62E827D3CED1C54, 'Unnamed ship ', 'Fulcrum'),
	(_binary 0x461E8014AFF0069DBBBC03B5D2879E8C, 2, 1, _binary 0x429CD199230927E0B62E827D3CED1C54, 'Unnamed ship ', 'Mouros'),
	(_binary 0x494607A9008C976582C96E69D85EC5B6, 1, 1, _binary 0x43A9AD364C590E73A8308CBBD4A02A58, 'Unnamed ship ', 'Fulcrum'),
	(_binary 0x4E57AAF753CBA8C28532DF98895AE4A8, 1, 1, _binary 0x43A9AD364C590E73A8308CBBD4A02A58, 'Unnamed ship ', 'Caliope');
/*!40000 ALTER TABLE `ship` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship_movement: ~16 rows (approximately)
DELETE FROM `ship_movement`;
/*!40000 ALTER TABLE `ship_movement` DISABLE KEYS */;
INSERT INTO `ship_movement` (`id`, `ship_id`, `game_id`, `turn`, `movement_index`, `data`) VALUES
	(_binary 0x40C4928E8E3A86728F3A2716BFC3EAD4, _binary 0x494607A9008C976582C96E69D85EC5B6, 1, 1, 2, '{"id":"8e3a8672-928e-40c4-8f3a-2716bfc3ead4","type":"deploy","position":{"x":-1299.038105676658,"y":0,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":2}'),
	(_binary 0x4102A3552767FB32A8C61D143FD10288, _binary 0x461E8014AFF0069DBBBC03B5D2879E8C, 1, 1, 2, '{"id":"2767fb32-a355-4102-a8c6-1d143fd10288","type":"deploy","position":{"x":1299.038105676658,"y":0,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":2}'),
	(_binary 0x4251EA2652DE9EF0B30CE1923311FAE8, _binary 0x41A0C2D4F0A77FBFB819CD8D1F6959DB, 1, 1, 1, '{"id":"52de9ef0-ea26-4251-b30c-e1923311fae8","type":"start","position":{"x":1277.387470582047,"y":37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x441F6BEEF734B496B139A7BB416A82AC, _binary 0x41A0C2D4F0A77FBFB819CD8D1F6959DB, 1, 1, 2, '{"id":"f734b496-6bee-441f-b139-a7bb416a82ac","type":"deploy","position":{"x":1277.387470582047,"y":37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":2}'),
	(_binary 0x4C0411AAB8120E4AA13CEC5E13B0CBAA, _binary 0x461E8014AFF0069DBBBC03B5D2879E8C, 1, 1, 1, '{"id":"b8120e4a-11aa-4c04-a13c-ec5e13b0cbaa","type":"start","position":{"x":1299.038105676658,"y":0,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4C433C738980B25D9354C8C29CCA526F, _binary 0x494607A9008C976582C96E69D85EC5B6, 1, 1, 1, '{"id":"8980b25d-3c73-4c43-9354-c8c29cca526f","type":"start","position":{"x":-1299.038105676658,"y":0,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4D41107A829963B6B84305C306641B9B, _binary 0x4E57AAF753CBA8C28532DF98895AE4A8, 1, 1, 1, '{"id":"829963b6-107a-4d41-b843-05c306641b9b","type":"start","position":{"x":-1320.6887407712688,"y":37.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":1}'),
	(_binary 0x4F96D50576F5AA30A142D808974CC07B, _binary 0x4E57AAF753CBA8C28532DF98895AE4A8, 1, 1, 2, '{"id":"76f5aa30-d505-4f96-a142-d808974cc07b","type":"deploy","position":{"x":-1320.6887407712688,"y":37.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}},"index":2}');
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
