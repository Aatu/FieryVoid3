import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { cargoClasses } from "../../cargo/cargo.mjs";

class AmmunitionStrategy extends ShipSystemStrategy {
  constructor(
    ammunitionClasses,
    ammoPerFireOrder,
    capacity,
    intakeInTurn,
    startLoadingAfter = 1
  ) {
    super();

    this.ammunitionClasses = [].concat(ammunitionClasses);
    this.capacity = capacity;
    this.startLoadingAfter = startLoadingAfter;
    this.intakeInTurn = intakeInTurn;
    this.ammoPerFireOrder = ammoPerFireOrder;

    this.selectedAmmo = new this.ammunitionClasses[
      this.ammunitionClasses.length - 1
    ]();
    this.turnsOffline = 0;
    this.targetLoad = this._buildInitialTargetLoad();

    this.changeTargetLoad = null;
    this.changeSelectedAmmo = null;

    this.loaded = [];
  }

  _buildInitialTargetLoad() {
    let amountUsed = 0;
    return this.ammunitionClasses.map((className, index) => {
      let amount = Math.floor(this.capacity / this.ammunitionClasses.length);
      let over = amount % this.ammoPerFireOrder;
      let under = over === 0 ? 0 : this.ammoPerFireOrder - over;

      const last = index === this.ammunitionClasses.length - 1;

      if (amount > this.capacity - amountUsed) {
        amount = this.capacity - amountUsed;
      } else if (last) {
        amount = this.capacity - amountUsed;
      } else if (over !== 0 && over <= under) {
        amount -= over;
      } else if (under !== 0 && amountUsed + amount + under <= this.capacity) {
        amount += under;
      }

      amountUsed += amount;

      return {
        object: new className(),
        amount
      };
    });
  }
  /*
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
          launchTarget: this.launchTarget,
          launcher: this
        }
      }
    ];
  }
  */

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      targetLoad: this.targetLoad.map(entry => ({
        className: entry.object.constructor.name,
        amount: entry.amount
      })),
      loaded: this.loaded.map(entry => ({
        className: entry.object.constructor.name,
        amount: entry.amount
      })),
      changeTargetLoad: this.changeTargetLoad
        ? this.changeTargetLoad.map(entry => ({
            className: entry.object.constructor.name,
            amount: entry.amount
          }))
        : null,
      turnsOffline: this.turnsOffline,
      selectedAmmo: this.selectedAmmo.constructor.name,
      changeSelectedAmmo: this.changeSelectedAmmo
        ? this.changeSelectedAmmo.constructor.name
        : null
    };
  }

  deserialize(data = {}) {
    this.targetLoad = data.targetLoad
      ? data.targetLoad.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : [];

    this.loaded = data.loaded
      ? data.loaded.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : [];

    this.changeTargetLoad = data.changeTargetLoad
      ? data.changeTargetLoad.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : null;

    this.turnsOffline = data.turnsOffline || 0;
    this.selectedAmmo = data.selectedAmmo
      ? new cargoClasses[data.selectedAmmo]()
      : new this.ammunitionClasses[this.ammunitionClasses.length - 1]();
    this.changeSelectedAmmo = data.changeSelectedAmmo
      ? new cargoClasses[data.changeSelectedAmmo]()
      : null;

    return this;
  }

  getSelectedAmmo() {
    return this.selectedAmmo;
  }

  getAmmoInMagazine() {
    return this.loaded;
  }

  loadTargetInstant() {
    this.loaded = this.targetLoad;
  }

  setNewLoadingTarget(target) {
    this.changeTargetLoad = target;
  }

  setNewSelectedAmmo(ammo) {
    this.changeSelectedAmmo = ammo;
  }

  receivePlayerData({ clientShip, clientSystem }) {
    if (!clientSystem) {
      return;
    }

    if (this.system.isDisabled()) {
      return;
    }

    const clientStrategy = clientSystem.getStrategiesByInstance(
      AmmunitionStrategy
    )[0];
    const changeTargetLoad = clientStrategy.changeTargetLoad;
    const changeSelectedAmmo = clientStrategy.changeSelectedAmmo;

    if (changeTargetLoad) {
      changeTargetLoad.forEach(entry => {
        if (
          !this.ammunitionClasses.some(
            className => entry.object instanceof className
          )
        ) {
          throw new Error(
            `Illegal ammo: '${
              entry.object.constructor.name
            }', allowed '${this.ammunitionClasses.join(", ")}'`
          );
        }

        if (!Number.isInteger(entry.amount) || entry.amount < 0) {
          throw new Error(`Illegal ammo amount: '${entry.amount}'`);
        }
      });

      if (
        changeTargetLoad.reduce((total, current) => total + current.amount, 0) >
        this.capacity
      ) {
        throw new Error(`Total capacity exeeded`);
      }
    }

    if (
      changeSelectedAmmo &&
      !this.ammunitionClasses
        .map(ammo => ammo.constructor.name)
        .includes(changeSelectedAmmo)
    ) {
      throw new Error(
        `Illegal selected ammo: '${changeSelectedAmmo}', allowed '${this.ammunitionClasses.join(
          ", "
        )}'`
      );
    }

    this.targetLoad = changeTargetLoad;
    this.selectedAmmo = changeSelectedAmmo;
  }

  canFire() {
    const entry = this.loaded.find(
      load => load.object.constructor === this.selectedAmmo.constructor
    );

    if (!entry) {
      return false;
    }

    if (entry.amount < this.ammoPerFireOrder) {
      return false;
    }

    return true;
  }

  afterWeaponFire() {
    const entry = this.loaded.find(
      load => load.object.constructor === this.selectedAmmo.constructor
    );

    if (!entry) {
      throw new Error(
        "Seems like you fired a weapon without ammo. That is not good"
      );
    }

    entry.amount -= this.ammoPerFireOrder;

    this.loaded = this.loaded.filter(entry => entry.amount > 0);

    if (this.loaded.length === 0) {
      return;
    }

    if (
      !this.loaded.find(
        load => load.object.constructor === this.selectedAmmo.constructor
      )
    ) {
      const newAmmo = this.loaded.find(
        entry => entry.amount > this.ammoPerFireOrder
      );

      if (newAmmo) {
        this.selectedAmmo = newAmmo.object;
      }
    }
  }

  advanceTurn() {
    if (this.system.isDestroyed()) {
      return;
    }

    console.log("advanceTurn");
    if (this.system.power.isOffline()) {
      this.turnsOffline++;
      console.log("now has been offline", this.turnsOffline);
    }

    if (this.turnsOffline > this.startLoadingAfter) {
      this._load();
    }
  }

  _load() {
    console.log("load!, intake", this.intakeInTurn);
    let ammoTransferredIn = 0;
    let ammoTransferredOut = 0;

    console.log("UNLOADING EXTRA");
    while (true) {
      if (ammoTransferredOut === this.intakeInTurn) {
        console.log("unloaded max amount of ammo");
        break;
      }

      if (
        this.loaded.every(loaded => {
          const target = this.targetLoad.find(
            target => target.object.constructor === loaded.object.constructor
          );

          if (target && target.amount >= loaded.amount) {
            console.log(
              loaded.object.constructor.name,
              "needs either to be loaded, or is perfectly loaded"
            );
            return true;
          }

          let extra = target ? loaded.amount - target.amount : loaded.amount;
          if (extra > this.intakeInTurn - ammoTransferredOut) {
            extra = this.intakeInTurn - ammoTransferredOut;
          }

          console.log(
            loaded.object.constructor.name,
            "nees to be unloaded, current amount",
            loaded.amount,
            "extra",
            extra
          );

          const systemWithSpace = this.system.shipSystems
            .getSystems()
            .find(system =>
              system.callHandler("hasCargoSpaceAvailable", {}, false)
            );

          if (!systemWithSpace) {
            console.log(
              "did not find any system with cargo space to unload to"
            );
            return true;
          }

          //TODO: Check that the cargo space can accommodate this much

          systemWithSpace.callHandler("addCargo", {
            cargo: loaded.object,
            amount: extra
          });
          ammoTransferredOut += extra;
          console.log("unloading", loaded.object.constructor.name, extra);
          loaded.amount -= extra;

          return false;
        })
      ) {
        console.log("FINISH UNLOAD");
        break;
      }
    }

    this.loaded = this.loaded.filter(entry => entry.amount > 0);

    console.log("LOADING");
    while (true) {
      if (ammoTransferredIn === this.intakeInTurn) {
        console.log("LOADED MAX AMOUNT");
        break;
      }

      if (
        this.targetLoad.every(target => {
          let loaded = this.loaded.find(
            loaded => target.object.constructor === loaded.object.constructor
          );

          if (!loaded) {
            loaded = {
              object: target.object,
              amount: 0
            };

            this.loaded.push(loaded);
          }

          if (loaded.amount === target.amount) {
            console.log(
              loaded.object.constructor.name,
              "has correct amount: ",
              loaded.amount,
              "target",
              target.amount
            );
            return true;
          }

          const cargoSystem = this.system.shipSystems
            .getSystems()
            .find(system =>
              system.callHandler("getCargoEntry", target.object, null)
            );

          if (!cargoSystem) {
            console.log(
              target.object.constructor.name,
              "was not found in any cargobay"
            );
            return true;
          }

          const cargo = cargoSystem.callHandler(
            "getCargoEntry",
            target.object,
            null
          );

          let missing = target.amount - loaded.amount;

          if (missing > this.intakeInTurn - ammoTransferredIn) {
            missing = this.intakeInTurn - ammoTransferredIn;
          }

          if (cargo.amount >= missing) {
            loaded.amount += missing;
            cargoSystem.callHandler("removeCargo", {
              cargo: cargo.object,
              amount: missing
            });
            ammoTransferredIn += missing;
          } else if (cargo.amount < missing) {
            loaded.amount += cargo.amount;
            cargoSystem.callHandler("removeCargo", {
              cargo: cargo.object,
              amount: cargo.amount
            });
            ammoTransferredIn += cargo.amount;
          }

          return false;
        })
      ) {
        break;
      }
    }
  }
}

export default AmmunitionStrategy;
