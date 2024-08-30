import { Offset } from "../hexagon";
import coordinateConverter from "../utils/CoordinateConverter";
import { InterceptionEntry } from "./InterceptorCandidate";
import Ship from "./Ship";
import TorpedoFlight, { InterceptionPriority } from "./TorpedoFlight";

export class TorpedoFlightForIntercept extends TorpedoFlight {
  private path: Offset[];
  private pathIndex: number = 0;
  private interceptors: InterceptionEntry[] = [];
  private hasNoInterceptionCandidates: boolean = false;

  constructor(flight: TorpedoFlight, target: Ship) {
    super(
      flight.torpedo,
      flight.targetId,
      flight.shooterId,
      flight.weaponId,
      flight.launcherIndex
    );
    this.id = flight.id;
    this.launchPosition = flight.launchPosition;
    this.strikePosition = flight.strikePosition;
    this.intercepted = flight.intercepted;
    this.done = flight.done;
    this.pathIndex = this.pathStartIndex;

    const targetPosition = target.movement
      .getLastEndMoveOrSurrogate()
      .getHexPosition();

    this.path = this.getStrikePositionHex().drawLine(targetPosition);
  }

  public setNoInterceptionCandidates() {
    this.hasNoInterceptionCandidates = true;
  }

  public getHasNoInterceptionCandidates() {
    return this.hasNoInterceptionCandidates;
  }

  public isFullyIntercepted() {
    return this.interceptors.length >= this.getMaxIntercepts();
  }

  resetInterceptors() {
    this.interceptors = [];
    this.hasNoInterceptionCandidates = false;
  }

  public addInterceptor(interceptor: InterceptionEntry) {
    this.interceptors.push(interceptor);
  }

  public getInterceptors() {
    return this.interceptors;
  }

  public getInterceptionPriority() {
    return this.interceptionPriority;
  }

  public getCurrentDistanceToTarget() {
    return this.path.length - this.pathIndex;
  }

  public getCurrentHexPosition() {
    return this.path[this.pathIndex];
  }

  public getCurrentPosition() {
    return coordinateConverter.fromHexToGame(this.path[this.pathIndex]);
  }

  public getClosestDistanceTo(ship: Ship) {
    return this.path.reduce((closest, hex) => {
      const distance = hex.distanceTo(ship.getHexPosition());
      return distance < closest ? distance : closest;
    }, Infinity);
  }

  public advance() {
    this.pathIndex++;
  }

  public getMaxIntercepts() {
    switch (this.interceptionPriority) {
      case InterceptionPriority.HIGH:
        return 6;
      case InterceptionPriority.MEDIUM:
        return 3;
      case InterceptionPriority.LOW:
        return 1;
      default:
        return 1;
    }
  }

  public isStricking(target: Ship) {
    if ((this.pathIndex = this.path.length - 1)) {
      return true;
    }
    const strikeDistance = this.torpedo
      .getDamageStrategy()
      .getStrikeDistance({ target, torpedoFlight: this });

    return this.getCurrentDistanceToTarget() <= strikeDistance;
  }
}
