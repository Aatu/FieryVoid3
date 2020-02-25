import Vector from "../utils/Vector.mjs";
import { cargoClasses } from "./system/cargo/cargo.mjs";
import uuidv4 from "uuid/v4.js";
import HexagonMath from "../utils/HexagonMath.mjs";

class TorpedoFlight {
  constructor(torpedo, targetId, shooterId, weaponId, launcherIndex) {
    this.id = uuidv4();
    this.torpedo = torpedo;
    this.targetId = targetId;
    this.shooterId = shooterId;
    this.weaponId = weaponId;
    this.launcherIndex = launcherIndex;
    this.launchPosition = new Vector();
    this.strikePosition = new Vector();
    this.intercepted = false;
  }

  setIntercepted() {
    this.intercepted = true;
  }

  getInterceptTries(target) {
    return this.torpedo.getInterceptTries(this, target);
  }

  getStrikeDistance(target) {
    return this.torpedo.getStrikeDistance(this, target);
  }

  setStrikePosition(position) {
    this.strikePosition = position;
    return this;
  }

  setLaunchPosition(position) {
    this.launchPosition = position;
    return this;
  }

  serialize() {
    return {
      id: this.id,
      torpedo: this.torpedo.constructor.name,
      targetId: this.targetId,
      strikePosition: this.strikePosition,
      shooterId: this.shooterId,
      weaponId: this.weaponId,
      launcherIndex: this.launcherIndex,
      intercepted: this.intercepted,
      launchPosition: this.launchPosition
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.torpedo = new cargoClasses[data.torpedo]();
    this.targetId = data.targetId;
    this.strikePosition = new Vector(data.strikePosition);
    this.launchPosition = new Vector(data.launchPosition);
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
