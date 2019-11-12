import StandardDamageStrategy from "./StandardDamageStrategy.mjs";

class PiercingDamageStrategy extends StandardDamageStrategy {
  _doDamage(
    payload,
    damageIds = [],
    lastSection,
    damage,
    armorPiercing = undefined
  ) {
    const { target, shooter } = payload;

    if (armorPiercing === undefined) {
      armorPiercing = this._getArmorPiercing();
    }

    const hitSystem = this._chooseHitSystem({
      target,
      shooter,
      lastSection
    });

    if (!hitSystem) {
      return damageIds;
    }

    let result = this._doDamageToSystem(
      payload,
      hitSystem,
      armorPiercing,
      this._getDamageForWeaponHit(payload)
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
      return this._doDamage(
        payload,
        damageIds,
        target.systems.sections.getSectionBySystem(hitSystem),
        undefined,
        armorPiercing
      );
    }

    result = this._doDamageToSystem(
      payload,
      overkillSystem,
      armorPiercing,
      this._getDamageForWeaponHit(payload)
    );

    if (result.damageEntry) {
      damageIds.push(result.damageEntry);
    }

    armorPiercing = result.armorPiercing;

    return this._doDamage(
      payload,
      damageIds,
      target.systems.sections.getSectionBySystem(overkillSystem),
      undefined,
      armorPiercing
    );
  }
}

export default PiercingDamageStrategy;
