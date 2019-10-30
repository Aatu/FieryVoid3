class ReplayContext {
  constructor(phaseStrategy) {
    this.firingDuration = 5000;
    this.movementDuration = 5000;
    this.replayShipMovement = null;
    this.replayShipWeaponFire = null;
    this.phaseStrategy = phaseStrategy;
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

  getMovementTurnDone({ total }) {
    if (total < this.firingDuration) {
      return 0;
    }

    const turnDone = (total - this.firingDuration) / this.movementDuration;
    return turnDone;
  }

  getTurnLength() {
    return this.firingDuration + this.movementDuration;
  }

  setReplayShipMovement(movement) {
    this.replayShipMovement = movement;
  }

  setReplayShipWeaponFire(fire) {
    this.replayShipWeaponFire = fire;
  }

  animationsReady() {
    return (
      this.replayShipMovement &&
      this.replayShipWeaponFire &&
      this.replayShipMovement.ready &&
      this.replayShipWeaponFire.ready
    );
  }

  getPositionAtTime(icon, percentDone) {
    return this.replayShipMovement.getPositionAtTime(icon, percentDone);
  }
}

export default ReplayContext;
