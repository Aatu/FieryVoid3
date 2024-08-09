import StandardDamageStrategy from "./StandardDamageStrategy";

class PiercingDamageStrategy extends StandardDamageStrategy {
  _getDamageTypeMessage() {
    return "Piercing";
  }

  _doDamage(
    payload,
    damageResult,
    lastSection,
    armorPiercing = undefined,
    damage
  ) {
    const { target, shooterPosition } = payload;

    if (armorPiercing === undefined) {
      armorPiercing = this._getArmorPiercing(payload);
    }

    const hitSystem = this._chooseHitSystem({
      target,
      shooterPosition,
      lastSection,
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
      return;
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
