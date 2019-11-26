import Vector from "../utils/Vector.mjs";
import { cargoClasses } from "./system/cargo/cargo.mjs";

class TorpedoFlight {
  constructor(torpedo, targetId, shooterId, weaponId, launcherIndex) {
    this.torpedo = torpedo;
    this.targetId = targetId;
    this.shooterId = shooterId;
    this.weaponId = weaponId;
    this.launcherIndex = launcherIndex;
    this.position = new Vector();
    this.velocity = new Vector();
  }

  setPosition(position) {
    this.position = position;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
  }

  serialize() {
    return {
      torpedo: this.torpedo.constructor.name,
      targetId: this.targetId,
      position: this.position,
      velocity: this.velocity
    };
  }

  deserialize(data) {
    this.torpedo = new cargoClasses[data.torpedo]();
    this.targetId = data.targetId;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);

    return this;
  }
}

export default TorpedoFlight;
