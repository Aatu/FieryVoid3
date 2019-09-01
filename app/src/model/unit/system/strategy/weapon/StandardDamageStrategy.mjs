import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { randomizeHitSystem } from "./utils/weaponUtils.mjs";
import DamageEntry from "../../DamageEntry.mjs";
import droll from "droll";

class StandardDamageStrategy extends ShipSystemStrategy {
  constructor(damageFormula, armorPiercingFormula) {
    super();

    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
  }

  getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
    return droll(this.damageFormula);
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
    shooter,
    target,
    weaponSettings,
    gameData,
    fireOrder,
    requiredToHit,
    rolledToHit
  }) {
    const hitSystem = this.chooseHitSystem({ target, shooter });
    const damage = this.getDamageForWeaponHit({ requiredToHit, rolledToHit });
    const armor = this.applyArmorPiercing({ armor: hitSystem.getArmor() });
    const entry = new DamageEntry(damage - armor, armor, fireOrder.id);
    hitSystem.rollCritical(entry);
    hitSystem.addDamage(entry);
    console.log("hitSystem", hitSystem, entry);
    console.log("remaining", hitSystem.getRemainingHitpoints());
  }
}

export default StandardDamageStrategy;
