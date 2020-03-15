import WeaponHitChance from "../weapon/WeaponHitChance.mjs";

class CombatLogWeaponFireHitResult {
  constructor(result, hitChance, hitRoll) {
    this.result = result;
    this.hitChance = hitChance;
    this.hitRoll = hitRoll;
  }

  serialize() {
    return {
      result: this.result,
      hitChance: this.hitChance.serialize(),
      hitRoll: this.hitRoll
    };
  }

  deserialize(data = {}) {
    this.result = data.result || false;
    this.hitChance = new WeaponHitChance().deserialize(data.hitChance);
    this.hitRoll = data.hitRoll || 1;

    return this;
  }
}

export default CombatLogWeaponFireHitResult;
