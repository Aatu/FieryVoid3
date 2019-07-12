import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { randomizeHitSystem } from "./utils/weaponUtils.mjs";
import DamageEntry from "../../DamageEntry.mjs";

class StandardDamageStrategy extends ShipSystemStrategy {
  constructor(damageFormula) {
    super();

    this.damageFormula = damageFormula;
  }

  getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
    return droll(damageFormula);
  }

  applyArmorPiercing({ armor }) {
    return armor;
  }

  chooseHitSystem({ target, shooter }) {
    return randomizeHitSystem(
      target.systems.getSystemsForHit(shooter.getPosition())
    );
  }

  applyDamageFromWeaponFire({
    fireOrder,
    gameData,
    requiredToHit,
    rolledToHit
  }) {
    const shooter = gameData.ships.getShipById(fireOrder.shooterId);
    const target = gameData.ships.getShipById(fireOrder.targetId);
    const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

    if (weapon !== this.system) {
      throw new Error("Wrong system");
    }

    const hitSystem = this.chooseHitSystem({ target, shooter });
    const damage = this.getDamageForWeaponHit({ requiredToHit, rolledToHit });
    const armor = this.applyArmorPiercing({ armor: hitSystem.getArmor() });
    const entry = new DamageEntry(damage - armor, armor, fireOrder.id);
    hitSystem.rollCritical(entry);
    hitSystem.addDamage(entry);
  }
}

export default StandardDamageStrategy;
