import { MEDIUM_WEAPON_RANGE } from "../../../model/src/config/gameConfig";
import GameData from "../../../model/src/game/GameData";
import Ship from "../../../model/src/unit/Ship";

export const getShipsThatShouldTargetOffensive = (
  ship: Ship,
  gameData: GameData
) => {
  const enemies = gameData.ships
    .getShipsEnemyTeams(ship.getPlayer().getUser())
    .filter((enemy) => {
      const distance = ship.hexDistanceTo(enemy);

      if (
        distance >
        MEDIUM_WEAPON_RANGE * 2 +
          (Math.random() * MEDIUM_WEAPON_RANGE - MEDIUM_WEAPON_RANGE / 2)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aDistance = ship.hexDistanceTo(a);
      const bDistance = ship.hexDistanceTo(b);

      if (aDistance > bDistance) {
        return 1;
      }

      if (aDistance < bDistance) {
        return -1;
      }

      return 0;
    });

  if (enemies.length === 0) {
    return [];
  }

  const random = Math.random();

  if (random > 0.9) {
    return [enemies[Math.floor(Math.random() * enemies.length)]];
  } else if (random > 0.7 && enemies.length >= 3) {
    return [enemies[0], enemies[1], enemies[2]];
  } else if (random > 0.4 && enemies.length >= 2) {
    return [enemies[0], enemies[1]];
  } else {
    return [enemies[0]];
  }
};
