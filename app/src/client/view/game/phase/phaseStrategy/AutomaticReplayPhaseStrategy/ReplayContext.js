import CombatLogBuilder from "./CombatLogBuilder";
import { ShipMovementAnimation } from "../../../animation";
import ShipVelocityAnimation from "../../../animation/ShipVelocityAnimation";

class ReplayContext {
  constructor(phaseStrategy) {
    this.firingDuration = 0;
    this.movementDuration = 0;
    this.velocityDuration = 0;
    this.phaseStrategy = phaseStrategy;
  }

  setMovementDuration(duration) {
    this.movementDuration = duration;
  }

  setVelocityDuration(duration) {
    this.velocityDuration = duration;
  }

  getVelocityStart() {
    return this.movementDuration + this.firingDuration;
  }

  getNextFireStart() {
    return this.movementDuration + this.firingDuration;
  }

  addFireAnimationDuration(duration) {
    this.firingDuration += duration;
  }

  pauseReplay() {
    this.phaseStrategy.pauseAnimation();
  }

  resumeReplay() {
    this.phaseStrategy.unpauseAnimation();
  }

  rewindToFiring() {
    this.phaseStrategy.setAnimationTime(this.movementDuration - 1);
  }

  rewindToMovement() {}

  getTurnLength() {
    return this.firingDuration + this.movementDuration + this.velocityDuration;
  }

  wrapGetShootingPosition(animations) {
    return icon => {
      return this.getShootingPosition(icon, animations);
    };
  }

  getShootingPosition(icon, animations) {
    let animation = animations.find(
      animation =>
        animation instanceof ShipMovementAnimation &&
        animation.shipIcon === icon
    );

    if (!animation) {
      throw new Error("Animation not found");
    }

    return animation.getEndPosition();
  }
}

export default ReplayContext;
