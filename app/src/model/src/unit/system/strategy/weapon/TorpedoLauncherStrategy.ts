import ShipSystemStrategy from "../ShipSystemStrategy";
import Torpedo from "../../weapon/ammunition/torpedo/Torpedo";
import {
  createTorpedoInstance,
  TropedoType,
} from "../../weapon/ammunition/torpedo";
import Ship from "../../../Ship";
import TorpedoFlight from "../../../TorpedoFlight";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import { CargoEntry } from "../../../../cargo/CargoService";
import ShipSystem from "../../ShipSystem";
import GameData from "../../../../game/GameData";
import { GAME_PHASE } from "../../../../game/gamePhase";

export type SerializedTorpedoLauncher = {
  turnsLoaded: number;
  loadedTorpedo: string | null;
  changeAmmo: { ammo: TropedoType; from: number } | null;
  launchTarget: string | null;
};

export type SerializedTorpedoLauncherStrategy = {
  torpedoLauncherStrategy: Record<number, SerializedTorpedoLauncher>;
};
class TorpedoLauncherStrategy extends ShipSystemStrategy {
  public launcherIndex: number;
  public loadedTorpedo: Torpedo | null;
  public torpedoClass: typeof Torpedo;
  public loadingTime: number;
  public nextTorpedoClass: typeof Torpedo | null;
  public turnsLoaded: number;
  public changeAmmo: { ammo: TropedoType; from: number } | null;
  public previousTorpedo: Torpedo | null;
  public launchTarget: string | null;
  private previousTurnsLoaded: number = 0;

  constructor(
    launcherIndex: number,
    loadedTorpedo: Torpedo | null,
    torpedoClass: typeof Torpedo,
    loadingTime: number
  ) {
    super();
    this.loadingTime = loadingTime;
    this.launcherIndex = launcherIndex;
    this.loadedTorpedo = loadedTorpedo;
    this.nextTorpedoClass = null;
    this.torpedoClass = torpedoClass;
    this.turnsLoaded = loadingTime;

    this.changeAmmo = null;
    this.previousTorpedo = null;
    this.launchTarget = null;
  }

  getUiComponents(
    payload: unknown,
    previousResponse = []
  ): {
    name: string;
    props: {
      launcherIndex: number;
      loadedTorpedo: Torpedo | null;
      loadingTime: number;
      turnsLoaded: number;
      torpedoClass: typeof Torpedo;
      launchTarget: string | null;
      launcher: TorpedoLauncherStrategy;
    };
  }[] {
    return [
      ...previousResponse,
      {
        name: "TorpedoLauncher",
        props: {
          launcherIndex: this.launcherIndex,
          loadedTorpedo: this.loadedTorpedo,
          loadingTime: this.loadingTime,
          turnsLoaded:
            this.turnsLoaded > this.loadingTime
              ? this.loadingTime
              : this.turnsLoaded,
          torpedoClass: this.torpedoClass,
          launchTarget: this.launchTarget,
          launcher: this,
        },
      },
    ];
  }

  serialize(
    payload: unknown,
    previousResponse: SerializedTorpedoLauncherStrategy = {
      torpedoLauncherStrategy: {},
    }
  ): SerializedTorpedoLauncherStrategy {
    return {
      ...previousResponse,
      torpedoLauncherStrategy: {
        ...previousResponse.torpedoLauncherStrategy,
        [this.launcherIndex]: {
          turnsLoaded: this.turnsLoaded,
          loadedTorpedo: this.loadedTorpedo
            ? this.loadedTorpedo.constructor.name
            : null,
          changeAmmo: this.changeAmmo,
          launchTarget: this.launchTarget,
        },
      },
    };
  }

  deserialize(
    data: SerializedTorpedoLauncherStrategy = { torpedoLauncherStrategy: [] }
  ) {
    const launcherData = data.torpedoLauncherStrategy[this.launcherIndex] || {};

    this.turnsLoaded = launcherData.turnsLoaded || 0;
    this.loadedTorpedo = launcherData.loadedTorpedo
      ? createTorpedoInstance(launcherData.loadedTorpedo as TropedoType)
      : null;

    this.changeAmmo = launcherData.changeAmmo || null;
    this.launchTarget = launcherData.launchTarget || null;

    return this;
  }

  loadAmmoInstant({
    ammo,
    launcherIndex,
  }: {
    ammo: Torpedo;
    launcherIndex: number;
  }) {
    if (
      launcherIndex !== this.launcherIndex ||
      (this.loadedTorpedo &&
        this.loadedTorpedo.constructor.name === ammo.constructor.name)
    ) {
      return;
    }

    this.loadedTorpedo = ammo;
    this.turnsLoaded = this.loadingTime;
  }

  unloadAmmo({ launcherIndex }: { launcherIndex: number }) {
    if (launcherIndex !== this.launcherIndex) {
      return;
    }

    //TODO: unload ammo
  }

  canLaunchAgainst({ target }: { target: Ship }) {
    if (this.turnsLoaded < this.loadingTime || !this.loadedTorpedo) {
      return false;
    }

    const distance = this.getSystem()
      .getShipSystems()
      .ship.hexDistanceTo(target);

    if (
      this.loadedTorpedo.minRange > distance ||
      this.loadedTorpedo.maxRange < distance
    ) {
      return false;
    }

    return true;
  }

  setLaunchTarget(shipId: string | null) {
    if (this.turnsLoaded < this.loadingTime || !this.loadedTorpedo) {
      return;
    }

    this.launchTarget = shipId;
  }

  launchTorpedo(
    payload: unknown,
    previousResponse: TorpedoFlight[] = []
  ): TorpedoFlight[] {
    if (
      this.turnsLoaded < this.loadingTime ||
      !this.loadedTorpedo ||
      !this.launchTarget
    ) {
      return previousResponse;
    }

    const result = new TorpedoFlight(
      this.loadedTorpedo,
      this.launchTarget,
      this.getSystem().getShipSystems().ship.id,
      this.getSystem().id,
      this.launcherIndex
    );

    const possibleNewTorpedos = this.getPossibleTorpedosToLoad();
    let newAmmo: { ammo: TropedoType; from: number } | null = null;

    const same = possibleNewTorpedos.find((torpedo) =>
      torpedo.object.equals(this.loadedTorpedo)
    );

    if (same) {
      const cargoBay = this.getSystem()
        .getShipSystems()
        .getSystems()
        .find((system) =>
          system.callHandler(
            SYSTEM_HANDLERS.hasCargo,
            { object: same.object },
            false as boolean
          )
        );

      if (!cargoBay) {
        throw new Error(
          `Did not find cargo bay for torpedo ${same.object.constructor.name}`
        );
      }

      newAmmo = {
        ammo: same.object.constructor.name as TropedoType,
        from: cargoBay.id,
      };
    } else if (possibleNewTorpedos.length > 0) {
      const newTorpedo =
        possibleNewTorpedos[possibleNewTorpedos.length - 1].object;
      const cargoBay = this.getSystem()
        .getShipSystems()
        .getSystems()
        .find((system) =>
          system.callHandler(
            SYSTEM_HANDLERS.hasCargo,
            { object: newTorpedo },
            false
          )
        );

      if (!cargoBay) {
        throw new Error(`Did not find cargo bay for torpedo ${newTorpedo}`);
      }

      newAmmo = {
        ammo: newTorpedo.constructor.name as TropedoType,
        from: cargoBay.id,
      };
    }

    this.loadedTorpedo = null;
    this.turnsLoaded = 0;

    if (newAmmo) {
      this.receiveAmmoChange(newAmmo);
    }

    return [...previousResponse, result];
  }

  loadAmmo({ ammo, launcherIndex }: { ammo: Torpedo; launcherIndex: number }) {
    if (
      launcherIndex !== this.launcherIndex ||
      (this.loadedTorpedo &&
        this.loadedTorpedo.constructor.name === ammo.constructor.name)
    ) {
      return;
    }

    const system = this.getSystems().find((system) =>
      system.callHandler(SYSTEM_HANDLERS.hasCargo, { object: ammo }, false)
    );

    if (!system) {
      return;
    }

    system.callHandler(
      SYSTEM_HANDLERS.removeCargo,
      { object: ammo },
      undefined
    );

    if (this.loadedTorpedo) {
      system.callHandler(
        SYSTEM_HANDLERS.addCargo,
        { object: this.loadedTorpedo },
        undefined
      );
    }

    if (
      this.previousTorpedo &&
      this.previousTorpedo.constructor.name === ammo.constructor.name
    ) {
      this.loadedTorpedo = this.previousTorpedo;
      this.turnsLoaded = this.previousTurnsLoaded;
      this.changeAmmo = null;
    } else {
      if (!this.previousTorpedo) {
        this.previousTorpedo = this.loadedTorpedo;
        this.previousTurnsLoaded = this.turnsLoaded;
      }

      this.turnsLoaded = 0;
      this.changeAmmo = {
        ammo: ammo.constructor.name as TropedoType,
        from: system.id,
      };
      this.loadedTorpedo = ammo;
    }

    this.launchTarget = null;
  }

  getLoadedLaunchers(
    payload: unknown,
    previousResponse: TorpedoLauncherStrategy[] = []
  ): TorpedoLauncherStrategy[] {
    if (this.turnsLoaded >= this.loadingTime && this.loadedTorpedo) {
      return [...previousResponse, this];
    }

    return previousResponse;
  }

  receiveAmmoChange(changeAmmo: { ammo: TropedoType; from: number }) {
    const ammo = createTorpedoInstance(changeAmmo.ammo);

    const cargoBay = this.getSystemById(changeAmmo.from);
    if (
      !cargoBay.callHandler(
        SYSTEM_HANDLERS.hasCargo,
        { object: ammo },
        false as boolean
      )
    ) {
      throw new Error(
        `Trying to take cargo form ${cargoBay.id}, but no appropriate cargo found`
      );
    }

    cargoBay.callHandler(
      SYSTEM_HANDLERS.removeCargo,
      { object: ammo },
      undefined
    );

    if (this.loadedTorpedo) {
      cargoBay.callHandler(
        SYSTEM_HANDLERS.addCargo,
        { object: this.loadedTorpedo },
        undefined
      );
    }

    this.loadedTorpedo = ammo;
    this.turnsLoaded = 0;
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

    const clientStrategy = getThisStrategy(clientSystem, this.launcherIndex);

    if (!clientStrategy) {
      return false;
    }

    const changeAmmo = clientStrategy.changeAmmo;

    if (changeAmmo) {
      this.receiveAmmoChange(changeAmmo);
    }

    if (clientStrategy.launchTarget) {
      const target = gameData.ships.getShipById(clientStrategy.launchTarget);

      if (!target) {
        throw new Error(
          `Did not find launch target ship id '${clientStrategy.launchTarget}'`
        );
      }

      if (!this.canLaunchAgainst({ target })) {
        throw new Error(`Can not launch torpedo`);
      }

      this.launchTarget = clientStrategy.launchTarget;
    }
  }

  getPossibleTorpedosToLoad() {
    const ammo: CargoEntry<Torpedo>[] = [];
    this.getSystem()
      .getShipSystems()
      .getSystems()
      .forEach((system) => {
        const possibleAmmo = system.callHandler(
          SYSTEM_HANDLERS.getCargoByParentClass,
          this.torpedoClass,
          [] as CargoEntry<Torpedo>[]
        );

        possibleAmmo.forEach((cargo) => {
          const entry = ammo.find(
            (ammoEntry) =>
              ammoEntry.object.constructor.name ===
              cargo.object.constructor.name
          );

          if (entry) {
            entry.amount += cargo.amount;
          } else {
            ammo.push({
              object: cargo.object,
              amount: cargo.amount,
            });
          }
        });
      });

    return ammo;
  }

  advanceTurn() {
    this.changeAmmo = null;
    this.previousTorpedo = null;
    this.launchTarget = null;

    if (this.getSystem().isDisabled() || !this.loadedTorpedo) {
      this.turnsLoaded = 0;
      return;
    }

    this.turnsLoaded++;
  }
}

const getThisStrategy = (
  system: ShipSystem,
  launcherIndex: number
): TorpedoLauncherStrategy => {
  const strategy = system.strategies.find(
    (strategy) =>
      strategy instanceof TorpedoLauncherStrategy &&
      strategy.launcherIndex === launcherIndex
  );

  if (!strategy) {
    throw new Error(
      `Did not find TorpedoLauncherStrategy. This should not happen`
    );
  }

  return strategy as TorpedoLauncherStrategy;
};

export default TorpedoLauncherStrategy;
