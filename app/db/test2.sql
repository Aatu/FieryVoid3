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

-- Dumping data for table fieryvoid.game: ~12 rows (approximately)
DELETE FROM `game`;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` (`id`, `name`, `turn`, `phase`, `active_ships`, `data`, `creator_id`, `status`) VALUES
	(1, 'Test game', 1, 'game', '["fdffdd7b-434c-458a-9d91-1e0768f625be","715cb042-836f-4602-81a4-a61569e07b11","1f853e46-42cc-462f-9f90-9c8e4f94b864","07c934ba-a5f4-4bc8-aba3-48449fb711e3"]', '{"activePlayerIds":[1,2],"slots":[{"id":"34405518-8e6d-4797-8e6b-03a2a23aa204","name":"Blue","userId":1,"deploymentLocation":{"q":-30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":10,"r":0},"points":3000,"shipIds":["fdffdd7b-434c-458a-9d91-1e0768f625be","07c934ba-a5f4-4bc8-aba3-48449fb711e3"],"team":1,"bought":true,"facing":0},{"id":"504a3852-cf0f-404e-baa4-7fda27968985","name":"Red","userId":2,"deploymentLocation":{"q":30,"r":0},"deploymentRadius":10,"deploymentVector":{"q":-10,"r":0},"points":3000,"shipIds":["715cb042-836f-4602-81a4-a61569e07b11","1f853e46-42cc-462f-9f90-9c8e4f94b864"],"team":2,"bought":true,"facing":0}],"terrain":[]}', 1, 'active');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_active_player: ~0 rows (approximately)
DELETE FROM `game_active_player`;
/*!40000 ALTER TABLE `game_active_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_active_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_event: ~0 rows (approximately)
DELETE FROM `game_event`;
/*!40000 ALTER TABLE `game_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_event` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_player: ~21 rows (approximately)
DELETE FROM `game_player`;
/*!40000 ALTER TABLE `game_player` DISABLE KEYS */;
INSERT INTO `game_player` (`game_id`, `user_id`, `last_activity`) VALUES
	(1, 1, '2019-07-06 23:34:23'),
	(1, 2, '2019-07-06 23:34:23');
/*!40000 ALTER TABLE `game_player` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_ship_data: ~43 rows (approximately)
DELETE FROM `game_ship_data`;
/*!40000 ALTER TABLE `game_ship_data` DISABLE KEYS */;
INSERT INTO `game_ship_data` (`game_id`, `ship_id`, `turn`, `phase`, `data`) VALUES
	(1, _binary 0x458A434CFDFFDD7B9D911E0768F625BE, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(1, _binary 0x458A434CFDFFDD7B9D911E0768F625BE, 1, 'game', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(1, _binary 0x4602836F715CB04281A4A61569E07B11, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x4602836F715CB04281A4A61569E07B11, 1, 'game', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x462F42CC1F853E469F909C8E4F94B864, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x462F42CC1F853E469F909C8E4F94B864, 1, 'game', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":2,"username":"player2","accessLevel":1}}'),
	(1, _binary 0x4BC8A5F407C934BAABA348449FB711E3, 1, 'deployment', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}'),
	(1, _binary 0x4BC8A5F407C934BAABA348449FB711E3, 1, 'game', '{"systems":[{"systemId":101,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":1,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":2,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":8,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":9,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":3,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":4,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":5,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":6,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":7,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":11,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}},{"systemId":201,"data":{"damage":{"entries":[],"criticals":[]},"power":{"entries":[]}}}],"player":{"id":1,"username":"player1","accessLevel":1}}');
/*!40000 ALTER TABLE `game_ship_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.game_system_data: ~0 rows (approximately)
DELETE FROM `game_system_data`;
/*!40000 ALTER TABLE `game_system_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_system_data` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship: ~32 rows (approximately)
DELETE FROM `ship`;
/*!40000 ALTER TABLE `ship` DISABLE KEYS */;
INSERT INTO `ship` (`id`, `user_id`, `game_id`, `slot_id`, `name`, `ship_class`) VALUES
	(_binary 0x458A434CFDFFDD7B9D911E0768F625BE, 1, 1, _binary 0x47978E6D344055188E6B03A2A23AA204, 'Unnamed ship ', 'Caliope'),
	(_binary 0x4602836F715CB04281A4A61569E07B11, 2, 1, _binary 0x404ECF0F504A3852BAA47FDA27968985, 'Unnamed ship ', 'Mouros'),
	(_binary 0x462F42CC1F853E469F909C8E4F94B864, 2, 1, _binary 0x404ECF0F504A3852BAA47FDA27968985, 'Unnamed ship ', 'Fulcrum'),
	(_binary 0x4BC8A5F407C934BAABA348449FB711E3, 1, 1, _binary 0x47978E6D344055188E6B03A2A23AA204, 'Unnamed ship ', 'Fulcrum');
/*!40000 ALTER TABLE `ship` ENABLE KEYS */;

-- Dumping data for table fieryvoid.ship_movement: ~70 rows (approximately)
DELETE FROM `ship_movement`;
/*!40000 ALTER TABLE `ship_movement` DISABLE KEYS */;
INSERT INTO `ship_movement` (`id`, `ship_id`, `game_id`, `turn`, `movement_index`, `data`) VALUES
	(_binary 0x4087FFE972BC6FEE83675ACA2D2CC7E2, _binary 0x462F42CC1F853E469F909C8E4F94B864, 1, 1, 0, '{"id":"72bc6fee-ffe9-4087-8367-5aca2d2cc7e2","type":"start","position":{"x":1277.387470582047,"y":37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x419984A8BC0168618A7487CCA95AFDA9, _binary 0x4BC8A5F407C934BAABA348449FB711E3, 1, 1, 0, '{"id":"bc016861-84a8-4199-8a74-87cca95afda9","type":"start","position":{"x":-1320.6887407712688,"y":37.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x44D1ADC7F16C8144B29590CAB0CB5783, _binary 0x458A434CFDFFDD7B9D911E0768F625BE, 1, 1, 1, '{"id":"f16c8144-adc7-44d1-b295-90cab0cb5783","type":"deploy","position":{"x":-974.2785792574934,"y":-112.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x44FAE987E110C82790293221F39528A3, _binary 0x4602836F715CB04281A4A61569E07B11, 1, 1, 0, '{"id":"e110c827-e987-44fa-9029-3221f39528a3","type":"start","position":{"x":1299.038105676658,"y":0,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x45CD71A2DCCA8C7A8EECEA110D76722D, _binary 0x4BC8A5F407C934BAABA348449FB711E3, 1, 1, 1, '{"id":"dcca8c7a-71a2-45cd-8eec-ea110d76722d","type":"deploy","position":{"x":-1320.6887407712688,"y":112.5,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x498818793D07DD0696CE49618BFD6E9C, _binary 0x462F42CC1F853E469F909C8E4F94B864, 1, 1, 1, '{"id":"3d07dd06-1879-4988-96ce-49618bfd6e9c","type":"deploy","position":{"x":1082.5317547305483,"y":150,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":2,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x4CDDDDAFD37BFE89B3F68C3712982DFC, _binary 0x458A434CFDFFDD7B9D911E0768F625BE, 1, 1, 0, '{"id":"d37bfe89-ddaf-4cdd-b3f6-8c3712982dfc","type":"start","position":{"x":-1299.038105676658,"y":0,"z":0},"velocity":{"x":433.0127018922193,"y":0,"z":0},"facing":0,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}'),
	(_binary 0x4FEB897EF99EAE8B985E28092B8AE339, _binary 0x4602836F715CB04281A4A61569E07B11, 1, 1, 1, '{"id":"f99eae8b-897e-4feb-985e-28092b8ae339","type":"deploy","position":{"x":974.2785792574934,"y":-37.5,"z":0},"velocity":{"x":-433.0127018922193,"y":0,"z":0},"facing":3,"rolled":false,"turn":1,"value":0,"requiredThrust":{"requirements":{},"fullfilments":{"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}}}');
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
