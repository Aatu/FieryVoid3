import { ShipMovementAnimation } from "../../../animation";
import ShipVelocityAnimation from "../../../animation/ShipVelocityAnimation";
import Structure from "../../../../../../model/unit/system/structure/Structure.mjs";

class ReplayContext {
  constructor(phaseStrategy) {
    this.firingDuration = 0;
    this.movementDuration = 0;
    this.torpedoMovementDuration = 0;
    this.torpedoAttackDuration = 0;
    this.phaseStrategy = phaseStrategy;
    this.systemsDestroyed = [];
  }

  getTorpedoMovementStart() {
    return (
      this.movementDuration + this.firingDuration + this.torpedoAttackDuration
    );
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
      this.movementDuration + this.firingDuration + this.torpedoAttackDuration
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

  noteDestroyedSystem(ship, time, systems) {
    this.systemsDestroyed.push({ ship, time, systems });
  }

  getDestroyedStructuresByShip(ship) {
    return this.systemsDestroyed
      .filter(({ ship: systemShip }) => ship === systemShip)
      .filter(({ systems }) =>
        systems.some((system) => system instanceof Structure)
      );
  }
}

export default ReplayContext;
