import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { randomizeHitSystem } from "./utils/weaponUtils.mjs";
import DamageEntry from "../../DamageEntry.mjs";

class StandardDamageStrategy extends ShipSystemStrategy {
  constructor(damageFormula = 0, armorPiercingFormula = 0) {
    super();

    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
  }

  applyDamageFromWeaponFire(payload) {
    const { fireOrder } = payload;
    const result = this._doDamage(payload);

    fireOrder.result.setDetails({
      type: "applyDamageFromWeaponFire",
      shotsHit: 1,
      totalShots: 1,
      shots: [result]
    });
  }

  _doDamage({
    shooter,
    target,
    weaponSettings,
    gameData,
    fireOrder,
    requiredToHit,
    rolledToHit
  }) {
    const hitSystem = this._chooseHitSystem({ target, shooter });
    const damage = this._getDamageForWeaponHit({ requiredToHit, rolledToHit });
    const { armor, armorPiercing, finalDamage } = this._applyArmorPiercing({
      armor: hitSystem.getArmor(),
      damage
    });
    const entry = new DamageEntry(finalDamage, armor, fireOrder.id);
    hitSystem.rollCritical(entry);
    hitSystem.addDamage(entry);

    return {
      damage,
      finalDamage,
      armor,
      armorPiercing
    };
  }

  _applyArmorPiercing({ armor, damage }) {
    const armorPiercing = this._getArmorPiercing();
    const finalArmor = armor - armorPiercing >= 0 ? armor - armorPiercing : 0;
    const finalDamage = finalArmor <= damage ? damage - finalArmor : 0;

    return {
      armor: finalArmor,
      armorPiercing,
      finalDamage
    };
  }

  _chooseHitSystem({ target, shooter }) {
    return randomizeHitSystem(
      target.systems.getSystemsForHit(shooter.getPosition())
    );
  }

  _getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
    if (Number.isInteger(this.damageFormula)) {
      return this.damageFormula;
    }
    return this.diceRoller.roll(this.damageFormula).total;
  }

  _getArmorPiercing() {
    if (Number.isInteger(this.armorPiercingFormula)) {
      return this.armorPiercingFormula;
    }

    return this.diceRoller.roll(this.armorPiercingFormula).total;
  }
}

export default StandardDamageStrategy;
