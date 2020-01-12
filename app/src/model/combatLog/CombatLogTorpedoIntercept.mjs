import WeaponHitChange from "../weapon/WeaponHitChange.mjs";

class CombatLogTorpedoIntercept {
  constructor(torpedoFlightId, shipId, weaponId, interceptChange, roll) {
    this.torpedoFlightId = torpedoFlightId;
    this.shipId = shipId;
    this.weaponId = weaponId;
    this.interceptChange = interceptChange;
    this.roll = roll;
  }

  isSucessfull() {
    return this.roll <= this.interceptChange.result;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      weaponId: this.weaponId,
      roll: this.roll,
      shipId: this.shipId,
      interceptChange: this.interceptChange.serialize()
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.weaponId = data.weaponId;
    this.roll = data.roll;
    this.shipId = data.shipId;
    this.interceptChange = new WeaponHitChange().deserialize(
      data.interceptChange
    );
    return this;
  }
}

export default CombatLogTorpedoIntercept;
