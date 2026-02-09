import GameData from "../../../model/src/game/GameData";
import Ship from "../../../model/src/unit/Ship";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import Weapon from "../../../model/src/unit/system/weapon/Weapon";

const weaponCanFire = (weapon: Weapon) => {
  if (
    weapon.isDisabled() ||
    !weapon.callHandler(SYSTEM_HANDLERS.usesFireOrders, null, false) ||
    !weapon.callHandler(SYSTEM_HANDLERS.canFire, null, true)
  ) {
    return false;
  }

  return true;
};

const sortTargetsByHitChange =
  (shooter: Ship, weapon: Weapon) => (a: Ship, b: Ship) => {
    const hitChanceA = weapon.callHandler(
      SYSTEM_HANDLERS.getHitChance,
      { shooter, target: a },
      0
    );
    const hitChanceB = weapon.callHandler(
      SYSTEM_HANDLERS.getHitChance,
      { shooter, target: b },
      0
    );

    if (hitChanceA > hitChanceB) {
      return 1;
    }

    if (hitChanceA < hitChanceB) {
      return -1;
    }

    return 0;
  };

const shouldFireAt = (shooter: Ship, target: Ship, weapon: Weapon) => {
  const hitChance = weapon.callHandler(
    SYSTEM_HANDLERS.getHitChance,
    { shooter, target },
    0
  );

  if (hitChance < 0) {
    return false;
  }

  if (hitChance > 50 + (Math.random() * 30 - 15)) {
    return true;
  }

  const loadingTime = weapon.callHandler(SYSTEM_HANDLERS.getLoadingTime, {}, 1);

  if (hitChance > loadingTime - 1 * 20) {
    return true;
  }

  return false;
};

export const getWeaponsThatShouldFire = (ship: Ship, gameData: GameData) => {
  const enemies = gameData.ships.getShipsEnemyTeams(ship.getPlayer().getUser());

  const weaponsAndTargets: { weapon: Weapon; target: Ship }[] = [];

  if (enemies.length === 0) {
    return;
  }

  const weapons = ship.systems
    .getSystems()
    .filter((system) => system.isWeapon())
    .filter(weaponCanFire);

  weapons.forEach((weapon) => {
    const target = enemies.sort(sortTargetsByHitChange(ship, weapon))[0];

    if (!shouldFireAt(ship, target, weapon)) {
      return;
    }

    weaponsAndTargets.push({ weapon, target });
  });

  return weaponsAndTargets;
};
