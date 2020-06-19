import { USER_AI } from "../../../model/AIUser.mjs";

const weaponCanFire = (weapon) => {
  if (
    weapon.isDisabled() ||
    !weapon.callHandler("usesFireOrders", null, false) ||
    !weapon.callHandler("canFire", null, true)
  ) {
    return false;
  }

  return true;
};

const sortTargetsByHitChange = (shooter, weapon) => (a, b) => {
  const hitChanceA = weapon.callHandler(
    "getHitChance",
    { shooter, target: a },
    0
  );
  const hitChanceB = weapon.callHandler(
    "getHitChance",
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

const shouldFireAt = (shooter, target, weapon, hitChance) => {
  const hitChance = weapon.callHandler(
    "getHitChance",
    { shooter: ship, target },
    0
  );

  if (hitChance < 0) {
    return false;
  }

  if (hitChance > 50 + (Math.random() * 30 - 15)) {
    return true;
  }

  const loadingTime = weapon.callHandler("getLoadingTime", {}, 1);

  if (hitChance > loadingTime - 1 * 20) {
    return true;
  }

  return false;
};

export const getWeaponsThatShouldFire = (ship, gameData) => {
  const enemies = gameData.ships.getShipsEnemyTeams(ship.player.user);

  const weaponsAndTargets = [];

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
