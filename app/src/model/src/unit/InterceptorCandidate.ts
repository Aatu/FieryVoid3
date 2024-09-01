import GameData from "../game/GameData";
import WeaponHitChance from "../weapon/WeaponHitChance";
import Ship from "./Ship";
import Weapon from "./system/weapon/Weapon";
import { TorpedoFlightForIntercept } from "./TorpedoFlightForIntercept";

export class InterceptorCandidate {
  private interceptor: Weapon;
  public entries: InterceptionEntry[] = [];

  constructor(interceptor: Weapon) {
    this.interceptor = interceptor;
  }

  addEntry(
    target: Ship,
    flight: TorpedoFlightForIntercept,
    gameData: GameData
  ) {
    if (!this.canIntercept()) {
      return;
    }

    if (
      gameData.slots.getTeamForShip(this.interceptor.getShip()) !==
      gameData.slots.getTeamForShip(target)
    ) {
      return;
    }

    if (
      flight
        .getCurrentHexPosition()
        .distanceTo(this.interceptor.getShip().getHexPosition()) > 10
    ) {
      return;
    }

    if (
      !this.interceptor.handlers.isPositionOnArc(flight.getCurrentPosition())
    ) {
      return;
    }

    const hitChance = this.interceptor.handlers.getInterceptChance(
      target,
      flight
    );

    if (hitChance.result > 0) {
      this.entries.push({
        target,
        torpedoFlight: flight,
        hitChance: hitChance,
        candidate: this,
      });
    }
  }

  wantToIntercept(flight: TorpedoFlightForIntercept): boolean {
    const entry = this.entries.find((entry) => entry.torpedoFlight === flight);

    if (!entry) {
      return false;
    }

    const targetsThisShip = flight.targetId === this.interceptor.getShip().id;

    const torpedoDefenseOpinion = this.interceptor
      .getShip()
      .torpedoDefense.canIntercept(
        flight.interceptionPriority,
        targetsThisShip,
        entry.hitChance.result
      );

    return torpedoDefenseOpinion;
  }

  getEntry(flight: TorpedoFlightForIntercept): InterceptionEntry {
    const entry = this.entries.find((entry) => entry.torpedoFlight === flight);

    if (!entry) {
      throw new Error("No entry found for flight");
    }

    return entry;
  }

  hasTargets(): boolean {
    return this.entries.length > 0 && this.canIntercept();
  }

  getInterceptor(): Weapon {
    return this.interceptor;
  }

  canIntercept(): boolean {
    return (
      this.getNumberOfShots() > this.getUsedIntercepts() &&
      this.interceptor.heat.getOverheatPercentage() < 1 &&
      this.interceptor.handlers.canFire()
    );
  }

  getUsedIntercepts(): number {
    return this.interceptor.handlers.getUsedIntercepts();
  }

  getNumberOfShots(): number {
    return this.interceptor.handlers.getNumberOfShots();
  }
}

export type InterceptionEntry = {
  target: Ship;
  torpedoFlight: TorpedoFlightForIntercept;
  hitChance: WeaponHitChance;
  candidate: InterceptorCandidate;
};
