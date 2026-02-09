import WeaponHitChance, {
  SerializedWeaponHitChance,
} from "../weapon/WeaponHitChance";

export type SerializedCombatLogWeaponFireHitResult = {
  result: boolean;
  hitChance: SerializedWeaponHitChance;
  hitRoll: number;
  shotsHit: number;
  shotsMissed: number;
};

class CombatLogWeaponFireHitResult {
  public result: boolean;
  public hitChance: WeaponHitChance;
  public hitRoll: number;
  public shotsHit: number;
  public shotsMissed: number;

  public static fromData(
    data: Partial<SerializedCombatLogWeaponFireHitResult> = {}
  ): CombatLogWeaponFireHitResult {
    return new CombatLogWeaponFireHitResult(
      data.result || false,
      new WeaponHitChance().deserialize(data.hitChance),
      data.hitRoll || 1
    );
  }

  constructor(
    result: boolean,
    hitChance: WeaponHitChance,
    hitRoll: number,
    shotsHit: number = result ? 1 : 0,
    shotsMissed: number = result ? 0 : 1
  ) {
    this.result = result;
    this.hitChance = hitChance;
    this.hitRoll = hitRoll;
    this.shotsHit = shotsHit;
    this.shotsMissed = shotsMissed;
  }

  serialize(): SerializedCombatLogWeaponFireHitResult {
    return {
      result: this.result,
      hitChance: this.hitChance.serialize(),
      hitRoll: this.hitRoll,
      shotsHit: this.shotsHit,
      shotsMissed: this.shotsMissed,
    };
  }

  deserialize(data: Partial<SerializedCombatLogWeaponFireHitResult> = {}) {
    this.result = data.result || false;
    this.hitChance = new WeaponHitChance().deserialize(data.hitChance);
    this.hitRoll = data.hitRoll || 1;

    return this;
  }
}

export default CombatLogWeaponFireHitResult;
