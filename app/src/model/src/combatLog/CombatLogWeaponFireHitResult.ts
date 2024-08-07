import WeaponHitChance, {
  SerializedWeaponHitChance,
} from "../weapon/WeaponHitChance";

export type SerializedCombatLogWeaponFireHitResult = {
  result?: boolean;
  hitChance?: SerializedWeaponHitChance;
  hitRoll?: number;
};

class CombatLogWeaponFireHitResult {
  public result: boolean;
  public hitChance: WeaponHitChance;
  public hitRoll: number;

  public static fromData(
    data: SerializedCombatLogWeaponFireHitResult = {}
  ): CombatLogWeaponFireHitResult {
    return new CombatLogWeaponFireHitResult(
      data.result || false,
      new WeaponHitChance().deserialize(data.hitChance),
      data.hitRoll || 1
    );
  }

  constructor(result: boolean, hitChance: WeaponHitChance, hitRoll: number) {
    this.result = result;
    this.hitChance = hitChance;
    this.hitRoll = hitRoll;
  }

  serialize(): SerializedCombatLogWeaponFireHitResult {
    return {
      result: this.result,
      hitChance: this.hitChance.serialize(),
      hitRoll: this.hitRoll,
    };
  }

  deserialize(data: SerializedCombatLogWeaponFireHitResult = {}) {
    this.result = data.result || false;
    this.hitChance = new WeaponHitChance().deserialize(data.hitChance);
    this.hitRoll = data.hitRoll || 1;

    return this;
  }
}

export default CombatLogWeaponFireHitResult;
