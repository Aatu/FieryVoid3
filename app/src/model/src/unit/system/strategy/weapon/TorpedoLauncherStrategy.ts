import { CargoEntry } from "../../../../cargo/CargoEntry";
import GameData from "../../../../game/GameData";
import { GAME_PHASE } from "../../../../game/gamePhase";
import Ship from "../../../Ship";
import { IShipSystemStrategy } from "../../../ShipSystemHandlers";
import TorpedoFlight from "../../../TorpedoFlight";
import ShipSystem from "../../ShipSystem";
import { createTorpedoInstance, TorpedoType } from "../../weapon/ammunition";
import Torpedo from "../../weapon/ammunition/torpedo/Torpedo";
import ShipSystemStrategy from "../ShipSystemStrategy";

type SerializedTorpedoLauncherStrategy = {
  torpedoLauncherSystemStrategy: {
    launchers: SerializedTorpedoLauncher[];
    shotsInMagazine: number;
    turnsOffline: number;
  };
};

export type TorpedoLaunchOptions = {
  systemId: number;
  numberOfReadyLaunchers: number;
  torpedosToLaunch: Torpedo[];
};

export class TorpedoLauncherStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  private torpedoClasses: TorpedoType[] = [];
  private launchers: TorpedoLauncher[] = [];
  public shotsInMagazine: number;
  public magazineSize: number;
  public reloadingTime: number;
  public turnsOffline: number = 0;

  constructor(
    torpedoClasses: TorpedoType[],
    numberOfLaunchers: number,
    launcherLoadingTime: number,
    magazineSize: number,
    reloadingTime: number
  ) {
    super();

    this.torpedoClasses = torpedoClasses;
    this.shotsInMagazine = magazineSize;
    this.magazineSize = magazineSize;
    this.reloadingTime = reloadingTime;

    while (numberOfLaunchers--) {
      this.launchers.push(new TorpedoLauncher(launcherLoadingTime));
    }
  }

  public getTorpedoLaunchOptions(payload: {
    target: Ship;
  }): TorpedoLaunchOptions {
    const launchers = this.launchers.filter((l) => l.canLaunch());
    const distance = this.getShip().hexDistanceTo(payload.target);

    const torpedos = this.torpedoClasses
      .map((c) => createTorpedoInstance(c))
      .filter(
        (torpedo) =>
          torpedo.minRange >= distance && torpedo.maxRange <= distance
      );

    return {
      systemId: this.getSystem().id,
      numberOfReadyLaunchers: launchers.length,
      torpedosToLaunch: torpedos,
    };
  }

  public setLaunchTarget({
    target,
    torpedo,
  }: {
    target: Ship;
    torpedo: Torpedo;
  }) {
    const plannedLaunches = this.launchers.reduce(
      (total, launcher) =>
        total + (Boolean(launcher.getLaunchTarget()) ? 1 : 0),
      1
    );

    if (this.shotsInMagazine < plannedLaunches) {
      throw new Error("Magazine empty");
    }

    if (
      !this.torpedoClasses.includes(torpedo.getCargoClassName() as TorpedoType)
    ) {
      throw new Error("Trying to launch wrong type of torpedo");
    }

    const distance = this.getShip().hexDistanceTo(target);

    if (torpedo.minRange > distance || torpedo.maxRange < distance) {
      throw new Error("Torpedo not in range");
    }

    const freeLauncher = this.launchers.filter((l) => l.canLaunch())[0];

    if (!freeLauncher) {
      throw new Error("No free launcher");
    }

    if (!this.getShip().shipCargo.hasCargo(new CargoEntry(torpedo, 1))) {
      throw new Error("Trying to launch more torpedos that the magazine has");
    }

    freeLauncher.setLaunchTarget(target, torpedo);
  }

  public launchTorpedos(): TorpedoFlight[] {
    return this.launchers
      .map((launcher) => {
        const targetId = launcher.getLaunchTarget();
        const torpedo = launcher.getTorpedo();

        launcher.launchTorpedo();

        if (!targetId || !torpedo) {
          return null;
        }

        if (!this.getShip().shipCargo.hasCargo(new CargoEntry(torpedo, 1))) {
          return null;
        }

        if (this.shotsInMagazine === 0) {
          return null;
        }

        const result = new TorpedoFlight(
          torpedo,
          targetId,
          this.getShip().id,
          this.getSystem().id
        );

        this.shotsInMagazine--;
        this.getShip().shipCargo.removeCargo(new CargoEntry(torpedo, 1));
        return result;
      })
      .filter(Boolean) as TorpedoFlight[];
  }

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }

    this.launchers.forEach((l) => l.advanceTurn());

    if (this.turnsOffline >= this.reloadingTime) {
      this.shotsInMagazine = this.magazineSize;
    }
  }

  serialize(
    payload: unknown,
    previousResponse: Record<string, unknown> = {}
  ): SerializedTorpedoLauncherStrategy {
    return {
      ...previousResponse,
      torpedoLauncherSystemStrategy: {
        launchers: this.launchers.map((l) => l.serialize()),
        shotsInMagazine: this.shotsInMagazine,
        turnsOffline: this.turnsOffline,
      },
    };
  }

  deserialize(data: Partial<SerializedTorpedoLauncherStrategy> = {}) {
    data?.torpedoLauncherSystemStrategy?.launchers.forEach(
      (launcherData, index) => this.launchers[index].deserialize(launcherData)
    );

    this.shotsInMagazine =
      data?.torpedoLauncherSystemStrategy?.shotsInMagazine ?? this.magazineSize;
    this.turnsOffline = data?.torpedoLauncherSystemStrategy?.turnsOffline ?? 0;
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
    return this.turnsLoaded >= this.loadingTime && !this.launchTarget;
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
