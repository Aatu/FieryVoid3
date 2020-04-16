import { ShipMovementAnimation } from "../../../animation";
import ShipVelocityAnimation from "../../../animation/ShipVelocityAnimation";

class ReplayContext {
  constructor(phaseStrategy) {
    this.firingDuration = 0;
    this.movementDuration = 0;
    this.torpedoMovementDuration = 0;
    this.torpedoAttackDuration = 0;
    this.phaseStrategy = phaseStrategy;
  }

  getTorpedoMovementStart() {
    return this.movementDuration + this.firingDuration;
  }

  setTorpedoMovementDuration(duration) {
    this.torpedoMovementDuration = duration;
  }

  getMovementStart() {
    return this.firingDuration + this.torpedoAttackDuration;
  }

  setMovementDuration(duration) {
    this.movementDuration = duration;
  }

  getNextFireStart() {
    return this.firingDuration;
  }

  addFireAnimationDuration(duration) {
    this.firingDuration += duration;
  }

  getNextTorpedoAttackStart() {
    return (
      this.movementDuration +
      this.torpedoMovementDuration +
      this.firingDuration +
      this.torpedoAttackDuration
    );
  }

  addTorpedoAttackAnimationDuration(duration) {
    this.torpedoAttackDuration += duration;
  }

  resumeReplayRewind() {
    this.phaseStrategy.unpauseAndRewindAnimation();
  }

  pauseReplay() {
    this.phaseStrategy.pauseAnimation();
  }

  resumeReplay() {
    this.phaseStrategy.unpauseAnimation();
  }

  rewindToFiring() {
    this.phaseStrategy.setAnimationTime(
      this.movementDuration + this.torpedoMovementDuration - 1
    );
  }

  rewindToMovement() {}

  getTurnLength() {
    return (
      this.firingDuration +
      this.torpedoAttackDuration +
      this.movementDuration +
      this.torpedoMovementDuration
    );
  }
}

export default ReplayContext;
