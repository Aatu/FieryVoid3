import WeaponHitChange from "./WeaponHitChange.mjs";

class FireOrderHitResult {
  constructor(result, hitChange, hitRoll) {
    this.result = result;
    this.hitChange = hitChange;
    this.hitRoll = hitRoll;
  }

  serialize() {
    return {
      name: "FireOrderHitResult",
      result: this.result,
      hitChange: this.hitChange.serialize(),
      hitRoll: this.hitRoll
    };
  }

  deserialize(data = {}) {
    this.result = data.result || false;
    this.hitChange = new WeaponHitChange().deserialize(data.hitChange);
    this.hitRoll = data.hitRoll || 1;

    return this;
  }
}

export default FireOrderHitResult;
