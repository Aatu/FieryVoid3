import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import HitSystemRandomizer from "./utils/HitSystemRandomizer.mjs";
import DamageEntry from "../../DamageEntry.mjs";

class StandardDamageStrategy extends ShipSystemStrategy {
  constructor(damageFormula = 0, armorPiercingFormula = 0) {
    super();

    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
    this.hitSystemRandomizer = new HitSystemRandomizer();
  }

  applyDamageFromWeaponFire(payload) {
    const { fireOrder, requiredToHit, rolledToHit } = payload;

    const hit = rolledToHit <= requiredToHit;

    const result = hit ? [this._doDamage(payload)] : [];

    fireOrder.result.setDetails({
      type: "applyDamageFromWeaponFire",
      shotsHit: hit ? 1 : 0,
      totalShots: 1,
      shots: result
    });
  }

  _doDamage(payload, damageIds = [], lastSection) {
    const { target, shooter } = payload;

    const hitSystem = this._chooseHitSystem({
      target,
      shooter,
      lastSection
    });

    if (!hitSystem) {
      return damageIds;
    }

    let armorPiercing = this._getArmorPiercing();
    let damage = this._getDamageForWeaponHit(payload);

    let result = this._doDamageToSystem(
      payload,
      hitSystem,
      armorPiercing,
      damage
    );

    if (result.damageEntry) {
      damageIds.push(result.damageEntry);
    }

    armorPiercing = result.armorPiercing;
    damage = result.damage;

    if (damage === 0) {
      return damageIds;
    }

    let overkillSystem = this._findOverkillStructure(hitSystem, target);

    if (!overkillSystem) {
      return this._doDamage(
        payload,
        damageIds,
        target.systems.sections.getSectionBySystem(hitSystem)
      );
    }

    result = this._doDamageToSystem(
      payload,
      overkillSystem,
      armorPiercing,
      damage
    );

    if (result.damageEntry) {
      damageIds.push(result.damageEntry);
    }

    armorPiercing = result.armorPiercing;
    damage = result.damage;

    if (damage === 0) {
      return damageIds;
    }

    return this._doDamage(
      payload,
      damageIds,
      target.systems.sections.getSectionBySystem(overkillSystem)
    );
  }

  _findOverkillStructure(system, ship) {
    const section = ship.systems.sections.getSectionBySystem(system);
    const structure = section.getStructure();

    if (!structure || structure.id === system.id) {
      return null;
    }

    return structure;
  }

  _doDamageToSystem({ fireOrder }, hitSystem, armorPiercing, damage) {
    let armor = hitSystem.getArmor();
    let finalArmor = armor - armorPiercing;
    if (finalArmor < 0) {
      finalArmor = 0;
    }

    damage -= finalArmor;

    let armorPiercingLeft = armorPiercing - armor;
    if (armorPiercingLeft < 0) {
      armorPiercingLeft = 0;
    }

    if (damage < 0) {
      damage = 0;
    }

    if (damage === 0) {
      return {
        damageEntry: null,
        armorPiercing: armorPiercingLeft,
        damage
      };
    }

    let entry = null;

    if (damage > hitSystem.getRemainingHitpoints()) {
      entry = new DamageEntry(
        hitSystem.getRemainingHitpoints(),
        finalArmor,
        fireOrder.id
      );
      damage -= hitSystem.getRemainingHitpoints();
    } else {
      entry = new DamageEntry(damage, finalArmor, fireOrder.id);

      damage = 0;
    }

    hitSystem.rollCritical(entry);
    hitSystem.addDamage(entry);

    return {
      damageEntry: entry,
      armorPiercing: armorPiercingLeft,
      damage
    };
  }

  _chooseHitSystem({ target, shooter, lastSection }) {
    if (Array.isArray(lastSection)) {
      console.log("array");
      console.trace();
    }
    return this.hitSystemRandomizer.randomizeHitSystem(
      target.systems.getSystemsForHit(
        shooter.getShootingPosition(),
        lastSection
      )
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
