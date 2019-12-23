import Vector from "../utils/Vector.mjs";
import { cargoClasses } from "./system/cargo/cargo.mjs";
import uuidv4 from "uuid/v4.js";

class TorpedoFlight {
  constructor(torpedo, targetId, shooterId, weaponId, launcherIndex) {
    this.id = uuidv4();
    this.torpedo = torpedo;
    this.targetId = targetId;
    this.shooterId = shooterId;
    this.weaponId = weaponId;
    this.launcherIndex = launcherIndex;
    this.position = new Vector();
    this.velocity = new Vector();

    this.reachedTarget = false;
    this.intercepted = false;
  }

  setIntercepted() {
    this.intercepted = true;
  }

  setReachedTarget() {
    this.reachedTarget = true;
  }

  getInterceptTries() {
    this.torpedo.getInterceptTries(this.velocity);
  }

  setImpactAngle(angle) {
    this.impactAngle = angle;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
    return this;
  }

  serialize() {
    return {
      id: this.id,
      torpedo: this.torpedo.constructor.name,
      targetId: this.targetId,
      position: this.position,
      velocity: this.velocity,
      shooterId: this.shooterId,
      weaponId: this.weaponId,
      launcherIndex: this.launcherIndex,
      intercepted: this.intercepted
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.torpedo = new cargoClasses[data.torpedo]();
    this.targetId = data.targetId;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.shooterId = data.shooterId;
    this.weaponId = data.weaponId;
    this.launcherIndex = data.launcherIndex;
    this.intercepted = data.intercepted || false;

    return this;
  }

  clone() {
    return new TorpedoFlight().deserialize(this.serialize());
  }
}

export default TorpedoFlight;
