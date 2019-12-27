import CombatLogBuilder from "./CombatLogBuilder";

class ReplayContext {
  constructor(phaseStrategy) {
    this.firingDuration = 0;
    this.movementDuration = 0;
    this.velocityDuration = 0;
    this.replayShipMovement = null;
    this.replayShipWeaponFire = null;
    this.phaseStrategy = phaseStrategy;
    this.combatLogBuilder = new CombatLogBuilder();
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

  pauseReplay() {
    this.phaseStrategy.pauseAnimation();
  }

  resumeReplay() {
    this.phaseStrategy.unpauseAnimation();
  }

  rewindToFiring() {
    this.phaseStrategy.setAnimationTime(0);
  }

  rewindToMovement() {}

  getTurnLength() {
    return this.firingDuration + this.movementDuration + this.velocityDuration;
  }

  getPositionAtTime(icon, percentDone) {
    return this.replayShipMovement.getPositionAtTime(icon, percentDone);
  }
}

export default ReplayContext;
