import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { cargoClasses } from "../../cargo/cargo.mjs";
import NoAmmunitionLoaded from "../../weapon/ammunition/NoAmmunitionLoaded.mjs";
import TorpedoFlight from "../../../TorpedoFlight.mjs";

class TorpedoLauncherStrategy extends ShipSystemStrategy {
  constructor(launcherIndex, loadedTorpedo, torpedoClass, loadingTime) {
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

  getUiComponents(payload, previousResponse = []) {
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
          launcher: this
        }
      }
    ];
  }

  serialize(payload, previousResponse = []) {
    const response = {
      ...previousResponse
    };

    response[`torpedoLauncherStrategy${this.launcherIndex}`] = {
      turnsLoaded: this.turnsLoaded,
      loadedTorpedo: this.loadedTorpedo
        ? this.loadedTorpedo.constructor.name
        : null,
      changeAmmo: this.changeAmmo,
      launchTarget: this.launchTarget
    };

    return response;
  }

  deserialize(data = {}) {
    const launcherData =
      data[`torpedoLauncherStrategy${this.launcherIndex}`] || {};

    this.turnsLoaded = launcherData.turnsLoaded || 0;
    this.loadedTorpedo = launcherData.loadedTorpedo
      ? new cargoClasses[launcherData.loadedTorpedo]()
      : null;

    this.changeAmmo = launcherData.changeAmmo || null;
    this.launchTarget = launcherData.launchTarget || null;

    return this;
  }

  loadAmmoInstant({ ammo, launcherIndex }) {
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

  unloadAmmo({ launcherIndex }) {
    if (launcherIndex !== this.launcherIndex) {
      return;
    }

    //TODO: unload ammo
  }

  setLaunchTarget(shipId) {
    if (this.turnsLoaded < this.loadingTime || !this.loadedTorpedo) {
      return;
    }

    this.launchTarget = shipId;
  }

  launchTorpedo(payload, previousResponse) {
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
      this.system.shipSystems.ship.id,
      this.system.id,
      this.launcherIndex
    );

    this.loadedTorpedo = null;
    this.turnsLoaded = 0;

    return [...previousResponse, result];
  }

  loadAmmo({ ammo, launcherIndex }) {
    if (
      launcherIndex !== this.launcherIndex ||
      (this.loadedTorpedo &&
        this.loadedTorpedo.constructor.name === ammo.constructor.name)
    ) {
      return;
    }

    const system = this.system.shipSystems
      .getSystems()
      .find(system => system.callHandler("hasCargo", { object: ammo }, false));

    system.callHandler("removeCargo", { object: ammo });

    if (this.loadedTorpedo) {
      system.callHandler("addCargo", { object: this.loadedTorpedo });
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
        ammo: ammo.constructor.name,
        from: system.id
      };
      this.loadedTorpedo = ammo;
    }

    this.launchTarget = null;
  }

  getLoadedLaunchers(payload, previousResponse) {
    if (this.turnsLoaded >= this.loadingTime && this.loadedTorpedo) {
      return [...previousResponse, this];
    }

    return previousResponse;
  }

  receiveAmmoChange(changeAmmo) {
    const ammo = new cargoClasses[changeAmmo.ammo]();

    const cargoBay = this.system.shipSystems.getSystemById(changeAmmo.from);
    if (!cargoBay.callHandler("hasCargo", { object: ammo })) {
      throw new Error(
        `Trying to take cargo form ${cargoBay.id}, but no appropriate cargo found`
      );
    }

    cargoBay.callHandler("removeCargo", { object: ammo });

    if (this.loadedTorpedo) {
      cargoBay.callHandler("addCargo", { object: this.loadedTorpedo });
    }

    this.loadedTorpedo = ammo;
    this.turnsLoaded = 0;
  }

  receivePlayerData({ clientShip, clientSystem }) {
    if (!clientSystem) {
      return;
    }

    if (this.system.isDisabled()) {
      return;
    }

    const clientStrategy = getThisStrategy(clientSystem, this.launcherIndex);
    const changeAmmo = clientStrategy.changeAmmo;

    if (changeAmmo) {
      this.receiveAmmoChange(changeAmmo);
    }

    if (clientStrategy.launchTarget) {
      if (this.turnsLoaded < this.loadingTime || !this.loadedTorpedo) {
        throw new Error(
          `Trying to set launch target, but weapon is not loaded`
        );
      }

      this.launchTarget = clientStrategy.launchTarget;
    }
  }

  getPossibleTorpedosToLoad() {
    const ammo = [];
    this.system.shipSystems.getSystems().forEach(system => {
      const possibleAmmo = system.callHandler(
        "getCargoByParentClass",
        this.torpedoClass,
        []
      );

      possibleAmmo.forEach(cargo => {
        const entry = ammo.find(
          ammoEntry =>
            ammoEntry.object.constructor.name === cargo.object.constructor.name
        );

        if (entry) {
          entry.amount += cargo.amount;
        } else {
          ammo.push({
            object: cargo.object,
            amount: cargo.amount
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

    if (this.system.isDisabled() || !this.loadedTorpedo) {
      this.turnsLoaded = 0;
      return;
    }

    this.turnsLoaded++;
  }
}

const getThisStrategy = (system, launcherIndex) => {
  return system.strategies.find(
    strategy =>
      strategy instanceof TorpedoLauncherStrategy &&
      strategy.launcherIndex === launcherIndex
  );
};

export default TorpedoLauncherStrategy;
