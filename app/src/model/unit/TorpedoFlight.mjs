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
    this.position = new Vector();
    this.launchPosition = new Vector();
    this.velocity = new Vector();

    this.reachedTarget = false;
    this.strikeEffectiveness = 0;
    this.intercepted = false;
    this.turnsActive = 0;
  }

  hasArmed() {
    return this.turnsActive > this.torpedo.armingTime;
  }

  noLongerActive() {
    return this.torpedo.turnsToLive < this.turnsActive;
  }

  getTorpedoGameDeltaVelocity() {
    return this.torpedo.deltaVelocityPerTurn * HexagonMath.getHexWidth();
  }

  getRelativeVelocityRatio(velocity) {
    if (velocity > this.torpedo.maxInterceptVelocity) {
      velocity = this.torpedo.maxInterceptVelocity;
    }

    return velocity / this.torpedo.maxInterceptVelocity;
  }

  setIntercepted() {
    this.intercepted = true;
  }

  setReachedTarget(strikeEffectiveness) {
    this.reachedTarget = true;
    this.strikeEffectiveness = strikeEffectiveness;
  }

  getInterceptTries() {
    return this.torpedo.getInterceptTries(this.strikeEffectiveness);
  }

  getStrikeDistance(target) {
    return this.torpedo.getStrikeDistance(this, target);
  }

  setImpactAngle(angle) {
    this.impactAngle = angle;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }

  setLaunchPosition(position) {
    this.launchPosition = position;
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
      intercepted: this.intercepted,
      launchPosition: this.launchPosition,
      turnsActive: this.turnsActive
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.torpedo = new cargoClasses[data.torpedo]();
    this.targetId = data.targetId;
    this.position = new Vector(data.position);
    this.launchPosition = new Vector(data.launchPosition);
    this.velocity = new Vector(data.velocity);
    this.shooterId = data.shooterId;
    this.weaponId = data.weaponId;
    this.launcherIndex = data.launcherIndex;
    this.intercepted = data.intercepted || false;
    this.turnsActive = data.turnsActive || 0;

    return this;
  }

  clone() {
    return new TorpedoFlight().deserialize(this.serialize());
  }
}

export default TorpedoFlight;
