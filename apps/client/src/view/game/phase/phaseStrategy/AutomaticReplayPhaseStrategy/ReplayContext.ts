import Ship from "@fieryvoid3/model/src/unit/Ship";
import PhaseStrategy from "../PhaseStrategy";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { Structure } from "@fieryvoid3/model/src/unit/system/structure";

class ReplayContext {
  private firingDuration: number;
  private movementDuration: number;
  private torpedoAttackDuration: number;
  private destroyedShipsDuration: number;
  private phaseStrategy: PhaseStrategy;
  private systemsDestroyed: {
    ship: Ship;
    time: number;
    systems: ShipSystem[];
  }[];

  constructor(phaseStrategy: PhaseStrategy) {
    this.firingDuration = 0;
    this.movementDuration = 0;
    this.torpedoAttackDuration = 0;
    this.destroyedShipsDuration = 0;
    this.phaseStrategy = phaseStrategy;
    this.systemsDestroyed = [];
  }

  getDestroyedShipsStart() {
    return (
      this.firingDuration +
      this.torpedoAttackDuration +
      this.movementDuration +
      this.destroyedShipsDuration
    );
  }

  addDestroyedShipsDuration(duration: number) {
    this.destroyedShipsDuration += duration;
  }

  getDestroyedShipsDuration() {
    return this.destroyedShipsDuration;
  }

  getMovementStart() {
    return this.firingDuration + this.torpedoAttackDuration;
  }

  setMovementDuration(duration: number) {
    this.movementDuration = duration;
  }

  getNextFireStart() {
    return this.firingDuration;
  }

  addFireAnimationDuration(duration: number) {
    this.firingDuration += duration;
  }

  getNextTorpedoAttackStart() {
    return this.movementDuration + this.firingDuration;
  }

  addTorpedoAttackAnimationDuration(duration: number) {
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
      this.firingDuration + this.torpedoAttackDuration + this.movementDuration
    );
  }

  rewindToMovement() {}

  getTurnLength() {
    return (
      this.firingDuration +
      this.torpedoAttackDuration +
      this.movementDuration +
      this.destroyedShipsDuration
    );
  }

  noteDestroyedSystem(ship: Ship, time: number, systems: ShipSystem[]) {
    this.systemsDestroyed.push({ ship, time, systems });
  }

  getDestroyedStructuresByShip(ship: Ship) {
    return this.systemsDestroyed
      .filter(({ ship: systemShip }) => ship === systemShip)
      .filter(({ systems }) =>
        systems.some((system) => system instanceof Structure)
      );
  }
}

export default ReplayContext;
