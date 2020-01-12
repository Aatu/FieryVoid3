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

  getTotalBurstSize() {
    return 1;
  }

  _getDamageMessage() {
    let messages = [];

    if (this.damageFormula) {
      messages.push(this.damageFormula);
    }

    const ammo = this.system.callHandler("getSelectedAmmo", null, null);

    if (ammo) {
      messages.push(ammo.damageFormula);
    }

    return messages.join(" + ammo: ");
  }

  _getArmorPiercingMessage() {
    let messages = [];

    if (this.armorPiercingFormula) {
      messages.push(this.armorPiercingFormula);
    }

    const ammo = this.system.callHandler("getSelectedAmmo", null, null);

    if (ammo) {
      messages.push(ammo.armorPiercingFormula);
    }

    return messages.join(" + ammo: ");
  }

  _getDamageTypeMessage() {
    return "Standard";
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Damage type",
      value: this._getDamageTypeMessage()
    });

    previousResponse.push({
      header: "Damage",
      value: this._getDamageMessage()
    });

    previousResponse.push({
      header: "Armor piercing",
      value: this._getArmorPiercingMessage()
    });

    return previousResponse;
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

    hitSystem.addDamage(entry);
    damageResult.add(hitSystem, entry);

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
    let damage = 0;
    if (Number.isInteger(this.damageFormula)) {
      damage = this.damageFormula;
    } else if (this.damageFormula !== null) {
      damage = this.diceRoller.roll(this.damageFormula).total;
    }

    if (!this.system) {
      return damage;
    }

    const ammo = this.system.callHandler("getSelectedAmmo", null, null);

    if (!ammo) {
      return damage;
    }

    return damage + ammo.getDamage(this.diceRoller);
  }

  _getArmorPiercing() {
    let armorPiercing = 0;
    if (Number.isInteger(this.armorPiercingFormula)) {
      armorPiercing = this.armorPiercingFormula;
    } else if (this.armorPiercingFormula !== null) {
      armorPiercing = this.diceRoller.roll(this.armorPiercingFormula).total;
    }

    if (!this.system) {
      return armorPiercing;
    }

    const ammo = this.system.callHandler("getSelectedAmmo", null, null);

    if (!ammo) {
      return armorPiercing;
    }

    return armorPiercing + ammo.getArmorPiercing(this.diceRoller);
  }
}

export default StandardDamageStrategy;
