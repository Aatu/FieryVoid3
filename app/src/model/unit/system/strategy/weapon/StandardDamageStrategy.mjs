import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import HitSystemRandomizer from "./utils/HitSystemRandomizer.mjs";
import DamageEntry from "../../DamageEntry.mjs";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry.mjs";

class StandardDamageStrategy extends ShipSystemStrategy {
  constructor(damageFormula = 0, armorPiercingFormula = 0) {
    super();

    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
    this.hitSystemRandomizer = new HitSystemRandomizer();
  }

  applyDamageFromWeaponFire(payload) {
    const { fireOrder, combatLogEntry, hitResolution } = payload;

    const hit = hitResolution.result;

    const result = new CombatLogDamageEntry();
    combatLogEntry.addDamage(result);

    if (hit) {
      combatLogEntry.setShots(1, 1);
      this._doDamage(
        { shooterPosition: payload.shooter.getPosition(), ...payload },
        result
      );
    } else {
      combatLogEntry.setShots(0, 1);
    }
  }

  _doDamage(
    payload,
    damageResult,
    lastSection,
    armorPiercing = undefined,
    damage = undefined
  ) {
    const { target, shooterPosition } = payload;

    if (armorPiercing === undefined) {
      armorPiercing = this._getArmorPiercing(payload);
    }

    if (damage === undefined) {
      damage = this._getDamageForWeaponHit(payload);
    }

    const hitSystem = this._chooseHitSystem({
      target,
      shooterPosition,
      lastSection
    });

    if (!hitSystem) {
      return;
    }

    let result = this._doDamageToSystem(
      payload,
      damageResult,
      hitSystem,
      armorPiercing,
      damage
    );

    armorPiercing = result.armorPiercing;
    damage = result.damage;

    if (damage === 0) {
      return damageResult;
    }

    let overkillSystem = this._findOverkillStructure(hitSystem, target);

    if (!overkillSystem) {
      return this._doDamage(
        payload,
        damageResult,
        target.systems.sections.getSectionBySystem(hitSystem),
        armorPiercing,
        damage
      );
    }

    result = this._doDamageToSystem(
      payload,
      damageResult,
      overkillSystem,
      armorPiercing,
      damage
    );

    armorPiercing = result.armorPiercing;
    damage = result.damage;

    if (damage === 0) {
      return;
    }

    return this._doDamage(
      payload,
      damageResult,
      target.systems.sections.getSectionBySystem(overkillSystem),
      armorPiercing,
      damage
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

  _doDamageToSystem(
    { fireOrder },
    damageResult,
    hitSystem,
    armorPiercing,
    damage
  ) {
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
        armorPiercing: armorPiercingLeft,
        damage
      };
    }

    let entry = null;

    if (damage > hitSystem.getRemainingHitpoints()) {
      entry = new DamageEntry(hitSystem.getRemainingHitpoints(), finalArmor);
      damage -= hitSystem.getRemainingHitpoints();
    } else {
      entry = new DamageEntry(damage, finalArmor);

      damage = 0;
    }

    const criticals = hitSystem.rollCritical(entry);
    hitSystem.addDamage(entry);
    damageResult.add(hitSystem, entry, criticals);

    return {
      armorPiercing: armorPiercingLeft,
      damage
    };
  }

  _chooseHitSystem({ target, shooterPosition, lastSection }) {
    return this.hitSystemRandomizer.randomizeHitSystem(
      target.systems.getSystemsForHit(shooterPosition, lastSection)
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
