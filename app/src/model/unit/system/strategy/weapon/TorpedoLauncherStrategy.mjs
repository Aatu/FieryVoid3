import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { cargoClasses } from "../../cargo/cargo.mjs";
import CargoBaySystemStrategy from "../CargoBaySystemStrategy.mjs";
import NoAmmunitionLoaded from "../../weapon/ammunition/NoAmmunitionLoaded.mjs";

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
          turnsLoaded: this.turnsLoaded,
          torpedoClass: this.torpedoClass,
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
      changeAmmo: this.changeAmmo
    };

    return response;
  }

  deserialize(data = {}) {
    const key = `torpedoLauncherStrategy${this.launcherIndex}`;

    this.turnsLoaded = data[key] ? data[key].turnsLoaded : 0;
    this.loadedTorpedo =
      data[key] && data[key].loadedTorpedo
        ? new cargoClasses[data[key].loadedTorpedo]()
        : null;

    this.changeAmmo = data[key] ? data[key].changeAmmo : null;

    return this;
  }

  loadAmmo(ammo) {
    if (
      this.loadedTorpedo &&
      this.loadedTorpedo.constructor.name === ammo.constructor.name
    ) {
      return;
    }

    if (ammo instanceof NoAmmunitionLoaded) {
      console.log("TODO: should unload ammo");
      return;
    }

    const system = this.system.shipSystems
      .getSystems()
      .find(system => system.callHandler("hasCargo", { cargo: ammo }, false));

    system.callHandler("removeCargo", { cargo: ammo });

    if (this.loadedTorpedo) {
      system.callHandler("addCargo", { cargo: this.loadedTorpedo });
    }

    this.loadedTorpedo = ammo;
    this.turnsLoaded = 0;
    this.changeAmmo = {
      ammo: ammo.constructor,
      from: system.id
    };
  }

  receivePlayerSystemData(system) {
    const incoming = getThisStrategy(system, this.launcherIndex);
    const changeAmmo = incoming.changeAmmo;

    if (!changeAmmo) {
      return;
    }

    const ammo = new cargoClasses[changeAmmo.ammo]();

    const cargoBay = this.system.shipSystems.getSystemById(changeAmmo.from);
    if (!cargoBay.callHandler("hasCargo", { cargo: ammo })) {
      throw new Error(
        `Trying to take cargo form ${cargoBay.id}, but no appropriate cargo found`
      );
    }

    cargoBay.callHandler("removeCargo", { cargo: ammo });

    if (this.loadedTorpedo) {
      cargoBay.callHandler("addCargo", { cargo: this.loadedTorpedo });
    }

    this.loadedTorpedo = ammo;
    this.turnsLoaded = 0;
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
            ammoEntry.object.constructor.name === cargo.constructor.name
        );

        if (entry) {
          entry.amount += cargo.amount;
        } else {
          ammo.push(cargo);
        }
      });
    });

    return ammo;
  }

  afterWeaponFire() {
    this.loadedTorpedo = null;
  }

  advanceTurn() {
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
