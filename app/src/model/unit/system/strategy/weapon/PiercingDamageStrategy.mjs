import StandardDamageStrategy from "./StandardDamageStrategy.mjs";

class PiercingDamageStrategy extends StandardDamageStrategy {
  _doDamage(
    payload,
    damageResult,
    lastSection,
    armorPiercing = undefined,
    damage
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
      return;
    }

    let result = this._doDamageToSystem(
      payload,
      damageResult,
      hitSystem,
      armorPiercing,
      this._getDamageForWeaponHit(payload)
    );

    armorPiercing = result.armorPiercing;
    damage = this._getDamageForWeaponHit(payload);

    if (armorPiercing === 0) {
      return damageResults;
    }

    let overkillSystem = this._findOverkillStructure(hitSystem, target);

    if (!overkillSystem) {
      return this._doDamage(
        payload,
        damageResult,
        target.systems.sections.getSectionBySystem(hitSystem),
        armorPiercing,
        undefined
      );
    }

    result = this._doDamageToSystem(
      payload,
      damageResult,
      overkillSystem,
      armorPiercing,
      this._getDamageForWeaponHit(payload)
    );

    armorPiercing = result.armorPiercing;

    return this._doDamage(
      payload,
      damageResult,
      target.systems.sections.getSectionBySystem(overkillSystem),
      armorPiercing,
      undefined
    );
  }
}

export default PiercingDamageStrategy;
