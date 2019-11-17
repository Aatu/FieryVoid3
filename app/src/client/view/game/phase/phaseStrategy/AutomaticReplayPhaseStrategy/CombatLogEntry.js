class CombatLogEntry {
  constructor(fireOrder, shooter, target, weapon, gameData) {
    this.fireOrder = fireOrder;
    this.shooter = shooter;
    this.target = target;
    this.weapon = weapon;
    this.gameData = gameData;
    this.damages = this.getDamageCaused();
  }

  getSystemsDestroyed() {
    return this.damages
      .filter(damage => damage.destroyedSystem)
      .map(damage => damage.system);
  }

  getTotalDamage() {
    return this.damages.reduce((total, damage) => total + damage.amount, 0);
  }

  getTotalArmor() {
    return this.damages.reduce((total, damage) => total + damage.armor, 0);
  }

  getDamageCaused() {
    return this.fireOrder.result
      .getDamageResolution()
      .shots.reduce(
        (damages, fireOrderDamageEntry) =>
          damages.concat(fireOrderDamageEntry.getDamages(this.target)),
        []
      );
  }
}

export default CombatLogEntry;
