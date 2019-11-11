import StandardDamageStrategy from "./StandardDamageStrategy.mjs";
import HitSystemRandomizer from "./utils/HitSystemRandomizer.mjs";
import DamageEntry from "../../DamageEntry.mjs";

class StandardDamageStrategy extends StandardDamageStrategy {
  _doDamage(payload, damageIds = [], ignoreSections = []) {
    const { target, shooter } = payload;

    const hitSystem = this._chooseHitSystem({
      target,
      shooter,
      ignoreSections
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
    damage = this._getDamageForWeaponHit(payload);

    if (armorPiercing === 0) {
      return damageIds;
    }

    let overkillSystem = this._findOverkillStructure(hitSystem, target);

    if (!overkillSystem) {
      return this._doDamage(payload, damageIds, [
        target.systems.sections.getSectionBySystem(hitSystem)
      ]);
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
    damage = this._getDamageForWeaponHit(payload);

    if (damage === 0) {
      return damageIds;
    }

    return this._doDamage(payload, damageIds, [
      target.systems.sections.getSectionBySystem(overkillSystem)
    ]);
  }
}

export default StandardDamageStrategy;
