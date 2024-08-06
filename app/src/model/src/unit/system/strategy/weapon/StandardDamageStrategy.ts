import ShipSystemStrategy from "../ShipSystemStrategy.js";
import HitSystemRandomizer from "./utils/HitSystemRandomizer.mjs";
import DamageEntry from "../../DamageEntry.js";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry.mjs";
import {
  SYSTEM_HANDLERS,
  SystemMessage,
} from "../types/SystemHandlersTypes.js";
import Ammo from "../../weapon/ammunition/Ammo";

class StandardDamageStrategy extends ShipSystemStrategy {
  private damageFormula: string | number;
  private armorPiercingFormula: string | number;
  private hitSystemRandomizer: HitSystemRandomizer;

  constructor(damageFormula = 0, armorPiercingFormula = 0) {
    super();

    this.damageFormula = damageFormula;
    this.armorPiercingFormula = armorPiercingFormula;
    this.hitSystemRandomizer = new HitSystemRandomizer();
  }

  getTotalBurstSize() {
    return 1;
  }

  protected getDamageMessage() {
    let messages = [];

    if (this.damageFormula) {
      messages.push(this.damageFormula);
    }

    const ammo = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      null,
      null as Ammo | null
    );

    if (ammo) {
      messages.push(ammo.damageFormula);
    }

    return messages.join(" + ammo: ");
  }

  protected getArmorPiercingMessage() {
    let messages = [];

    if (this.armorPiercingFormula) {
      messages.push(this.armorPiercingFormula);
    }

    const ammo = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      null,
      null as Ammo | null
    );

    if (ammo) {
      messages.push(ammo.armorPiercingFormula);
    }

    return messages.join(" + ammo: ");
  }

  protected getDamageTypeMessage() {
    return "Standard";
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Damage type",
      value: this.getDamageTypeMessage(),
    });

    previousResponse.push({
      header: "Damage",
      value: this.getDamageMessage(),
    });

    previousResponse.push({
      header: "Armor piercing",
      value: this.getArmorPiercingMessage(),
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

  protected doDamage(
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
      lastSection,
    });

    if (!hitSystem) {
      damageResult.addNote("Unable to find system to hit");
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
      return this.doDamage(
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

    return this.doDamage(
      payload,
      damageResult,
      target.systems.sections.getSectionBySystem(overkillSystem),
      armorPiercing,
      damage
    );
  }

  protected findOverkillStructure(system, ship) {
    const section = ship.systems.sections.getSectionBySystem(system);
    const structure = section.getStructure();

    if (!structure || structure.id === system.id || structure.isDestroyed()) {
      return null;
    }

    return structure;
  }

  protected doDamageToSystem(
    {},
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

    let entry = null;

    if (damage > hitSystem.getRemainingHitpoints()) {
      if (hitSystem.getRemainingHitpoints() <= 0) {
        throw new Error("Trying to damage destroyed system");
      }

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
      damage,
    };
  }

  protected chooseHitSystem({ target, shooterPosition, lastSection }) {
    return this.hitSystemRandomizer.randomizeHitSystem(
      target.systems.getSystemsForHit(shooterPosition, lastSection)
    );
  }

  protected getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
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

  protected getArmorPiercing() {
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
