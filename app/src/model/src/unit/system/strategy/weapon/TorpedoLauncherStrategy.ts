import { CargoEntry } from "../../../../cargo/CargoEntry";
import GameData from "../../../../game/GameData";
import { GAME_PHASE } from "../../../../game/gamePhase";
import Ship from "../../../Ship";
import { IShipSystemStrategy } from "../../../ShipSystemHandlers";
import TorpedoFlight from "../../../TorpedoFlight";
import ShipSystem from "../../ShipSystem";
import {
  createTorpedoInstance,
  TorpedoType,
} from "../../weapon/ammunition/torpedo";
import Torpedo from "../../weapon/ammunition/torpedo/Torpedo";
import ShipSystemStrategy from "../ShipSystemStrategy";

type SerializedTorpedoLauncherStrategy = {
  torpedoLauncherSystemStrategy: {
    launchers: SerializedTorpedoLauncher[];
  };
};

export type TorpedoLaunchOptions = {
  systemId: number;
  numberOfReadyLaunchers: number;
  torpedosToLaunch: CargoEntry<Torpedo>[];
};

export class TorpedoLauncherStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  private torpedoClasses: TorpedoType[] = [];
  private launchers: TorpedoLauncher[] = [];

  constructor(
    torpedoClasses: TorpedoType[],
    numberOfLaunchers: number,
    launcherLoadingTime: number
  ) {
    super();

    this.torpedoClasses = torpedoClasses;
    while (numberOfLaunchers--) {
      this.launchers.push(new TorpedoLauncher(launcherLoadingTime));
    }
  }

  public getTorpedoLaunchOptions(payload: {
    target: Ship;
  }): TorpedoLaunchOptions {
    const launchers = this.launchers.filter((l) => l.canLaunch());

    const distance = this.getShip().hexDistanceTo(payload.target);

    const torpedos = this.getSystem()
      .handlers.getAllCargo()
      .filter((c) => {
        if (
          !this.torpedoClasses.includes(
            c.object.getCargoClassName() as TorpedoType
          )
        ) {
          return false;
        }

        const torpedo = c.object as Torpedo;

        if (torpedo.minRange > distance || torpedo.maxRange < distance) {
          return false;
        }

        return true;
      });

    return {
      systemId: this.getSystem().id,
      numberOfReadyLaunchers: launchers.length,
      torpedosToLaunch: torpedos as CargoEntry<Torpedo>[],
    };
  }

  public setLaunchTarget({
    target,
    torpedo,
  }: {
    target: Ship;
    torpedo: Torpedo;
  }) {
    const distance = this.getShip().hexDistanceTo(target);

    if (torpedo.minRange > distance || torpedo.maxRange < distance) {
      return false;
    }

    const amountOfSameTypeTorpedoBeingLaunched = this.launchers.reduce(
      (total, launcher) =>
        total + (launcher.getTorpedo()?.equals(torpedo) ? 1 : 0),
      0
    );

    const freeLauncher = this.launchers.filter((l) => l.canLaunch())[0];

    if (!freeLauncher) {
      throw new Error("No free launcher");
    }

    const torpedoCargo = this.getSystem().handlers.getCargoEntry(torpedo);

    if (
      !torpedoCargo ||
      torpedoCargo.amount < amountOfSameTypeTorpedoBeingLaunched + 1
    ) {
      throw new Error("Trying to launch more torpedos that the magazine has");
    }

    freeLauncher.setLaunchTarget(target, torpedo);
  }

  public launchTorpedos(): TorpedoFlight[] {
    return this.launchers
      .map((launcher) => {
        const targetId = launcher.getLaunchTarget();
        const torpedo = launcher.getTorpedo();

        if (!targetId || !torpedo) {
          return null;
        }

        const result = new TorpedoFlight(
          torpedo,
          targetId,
          this.getShip().id,
          this.getSystem().id
        );

        launcher.launchTorpedo();
        this.getSystem().handlers.removeCargo(new CargoEntry(torpedo, 1));
        return result;
      })
      .filter(Boolean) as TorpedoFlight[];
  }

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      return;
    }

    this.launchers.forEach((l) => l.advanceTurn());
  }

  serialize(payload: unknown, previousResponse: Record<string, unknown> = {}) {
    return {
      ...previousResponse,
      torpedoLauncherSystemStrategy: {
        launchers: this.launchers.map((l) => l.serialize()),
      },
    };
  }

  deserialize(data: Partial<SerializedTorpedoLauncherStrategy> = {}) {
    data?.torpedoLauncherSystemStrategy?.launchers.forEach(
      (launcherData, index) => this.launchers[index].deserialize(launcherData)
    );
  }

  getLaunchers() {
    return this.launchers;
  }

  receivePlayerData({
    clientSystem,
    gameData,
    phase,
  }: {
    clientSystem: ShipSystem;
    gameData: GameData;
    phase: GAME_PHASE;
  }) {
    if (phase !== GAME_PHASE.GAME) {
      return;
    }

    if (!clientSystem) {
      return;
    }

    if (this.getSystem().isDisabled()) {
      return;
    }

    const clientStrategy =
      clientSystem.getStrategiesByInstance<TorpedoLauncherStrategy>(
        TorpedoLauncherStrategy
      )[0];

    if (!clientStrategy) {
      return false;
    }

    clientStrategy.getLaunchers().forEach((launcher) => {
      const targetId = launcher.getLaunchTarget();
      const torpedo = launcher.getTorpedo();

      if (!targetId || !torpedo) {
        return;
      }

      const targetShip = gameData.ships.getShipById(targetId);

      if (
        !targetShip ||
        gameData.ships.isSameTeam(targetShip, this.getShip())
      ) {
        return;
      }

      this.setLaunchTarget({
        target: targetShip,
        torpedo,
      });
    });
  }
}

type SerializedTorpedoLauncher = {
  turnsLoaded: number;
  launchTarget: string | null;
  torpedoToLaunch: TorpedoType;
};

class TorpedoLauncher {
  private loadingTime: number = 3;
  private turnsLoaded: number = 3;
  private launchTarget: string | null = null;
  private torpedoToLaunch: Torpedo | null = null;

  constructor(loadingTime: number) {
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
  }

  public getLaunchTarget() {
    return this.launchTarget;
  }

  public getTorpedo() {
    return this.torpedoToLaunch;
  }

  public advanceTurn() {
    this.turnsLoaded++;
  }

  public setLaunchTarget(target: Ship, torpedo: Torpedo) {
    this.launchTarget = target.id;
    this.torpedoToLaunch = torpedo;
  }

  public launchTorpedo() {
    this.turnsLoaded = 0;
    this.launchTarget = null;
    this.torpedoToLaunch = null;
  }

  public canLaunch() {
    this.turnsLoaded >= this.loadingTime && !this.launchTarget;
  }

  public serialize(): SerializedTorpedoLauncher {
    return {
      turnsLoaded: this.turnsLoaded,
      launchTarget: this.launchTarget,
      torpedoToLaunch:
        (this.torpedoToLaunch?.getCargoClassName() as TorpedoType) || null,
    };
  }

  public deserialize(data?: Partial<SerializedTorpedoLauncher>) {
    this.turnsLoaded = data?.turnsLoaded ?? this.turnsLoaded;
    this.launchTarget = data?.launchTarget || null;
    this.torpedoToLaunch = data?.torpedoToLaunch
      ? createTorpedoInstance(data.torpedoToLaunch)
      : null;
  }
}
