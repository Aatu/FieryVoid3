import ShipSystemStrategy from "../ShipSystemStrategy.mjs";
import { cargoClasses } from "../../cargo/cargo.mjs";
import CargoService from "../../../../cargo/CargoService.mjs";

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

  getIconText(payload, previousResponse = "") {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    if (this.system.callHandler("isLoaded", null, null) === false) {
      return previousResponse;
    }

    return this.getSelectedAmmo().getIconText();
  }

  getUiComponents({ myShip }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.system.isDestroyed()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        name: "Ammo",
        props: {
          ammoStrategy: this
        }
      }
    ];
  }

  getTooltipMenuButton({ myShip }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        img: this.getSelectedAmmo().getBackgroundImage(),
        onClickHandler: () => {
          this.toggleSelectedAmmo();
        },
        onDisabledHandler: () => false
      }
    ];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      ammunitionStrategy: {
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
      }
    };
  }

  deserialize(data = {}) {
    const ammoData = data.ammunitionStrategy || {};
    this.targetLoad = ammoData.targetLoad
      ? ammoData.targetLoad.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : [];

    this.loaded = ammoData.loaded
      ? ammoData.loaded.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : [];

    this.changeTargetLoad = ammoData.changeTargetLoad
      ? ammoData.changeTargetLoad.map(entry => ({
          object: new cargoClasses[entry.className](),
          amount: entry.amount
        }))
      : null;

    this.turnsOffline = ammoData.turnsOffline || 0;
    this.selectedAmmo = ammoData.selectedAmmo
      ? new cargoClasses[ammoData.selectedAmmo]()
      : new this.ammunitionClasses[this.ammunitionClasses.length - 1]();
    this.changeSelectedAmmo = ammoData.changeSelectedAmmo
      ? new cargoClasses[ammoData.changeSelectedAmmo]()
      : null;

    return this;
  }

  toggleSelectedAmmo() {
    let index = null;
    this.loaded.forEach((entry, i) => {
      if (this.getSelectedAmmo().constructor === entry.object.constructor) {
        index = i;
      }
    });

    if (index + 1 > this.loaded.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }

    this.changeSelectedAmmo = this.loaded[index].object;
  }

  getSelectedAmmo() {
    return this.changeSelectedAmmo || this.selectedAmmo;
  }

  getLoadingTarget() {
    return this.changeTargetLoad || this.targetLoad;
  }

  getAmmoInMagazine() {
    return this.loaded;
  }

  loadTargetInstant() {
    this.loaded = this.targetLoad;
  }

  getLoadingTargetAmount() {
    return this.getLoadingTarget().reduce(
      (total, { amount }) => total + amount,
      0
    );
  }

  addToLoading({ object, amount }) {
    if (!this.changeTargetLoad) {
      this.changeTargetLoad = this.targetLoad.map(entry => ({
        ...entry
      }));
    }

    let entry = this.changeTargetLoad.find(
      entry => entry.object.constructor === object.constructor
    );

    if (!entry && amount > 0) {
      entry = {
        object,
        amount: 0
      };

      this.changeTargetLoad.push(entry);
    } else if (!entry && amount < 0) {
      return;
    }

    if (this.getLoadingTargetAmount() + amount > this.capacity) {
      return;
    }

    if (entry.amount + amount < 0) {
      return;
    }

    entry.amount += amount;
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

    if (this.system.power.isOffline()) {
      //this is fine
    } else if (this.system.isDisabled()) {
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

      this.targetLoad = changeTargetLoad;
    }

    if (changeSelectedAmmo) {
      if (
        !this.ammunitionClasses.some(
          ammoClass => changeSelectedAmmo instanceof ammoClass
        )
      ) {
        throw new Error(
          `Illegal selected ammo: '${changeSelectedAmmo.constructor.name}'`
        );
      }

      this.selectedAmmo = changeSelectedAmmo;
    }
  }

  shouldBeOffline(payload, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    return this.loaded.every(({ amount }) => amount < this.ammoPerFireOrder);
  }

  canFire(payload, previousResponse = true) {
    const entry = this.loaded.find(
      load => load.object.constructor === this.selectedAmmo.constructor
    );

    if (!entry) {
      return false;
    }

    if (entry.amount < this.ammoPerFireOrder) {
      return false;
    }

    return previousResponse;
  }

  onIntercept() {
    this.onWeaponFired();
  }

  onWeaponFired() {
    const entry = this.loaded.find(
      load => load.object.constructor === this.selectedAmmo.constructor
    );

    if (!entry) {
      throw new Error(
        "Seems like you fired a weapon without ammo. That is not good"
      );
    }

    entry.amount -= this.ammoPerFireOrder;

    this.system.log
      .getGenericLogEntry()
      .addMessage(
        `Expended ordnance: ${
          this.ammoPerFireOrder
        } x ${this.selectedAmmo.getDisplayName()}`
      );

    this.loaded = this.loaded.filter(entry => entry.amount > 0);
    this._changeSelectedAmmoIfOutOfAmmo();
  }

  advanceTurn() {
    if (this.system.power.isOffline()) {
      this.turnsOffline++;
    } else if (this.system.isDisabled()) {
      return;
    } else {
      this.turnsOffline = 0;
    }

    if (this.turnsOffline > this.startLoadingAfter) {
      this._load();
    }
  }

  _changeSelectedAmmoIfOutOfAmmo() {
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

  _load() {
    let ammoTransferredIn = 0;
    let ammoTransferredOut = 0;

    const ship = this.system.shipSystems.ship;
    const cargoService = new CargoService();

    while (true) {
      if (ammoTransferredOut === this.intakeInTurn) {
        break;
      }

      if (
        this.loaded.every(loaded => {
          const target = this.targetLoad.find(
            target => target.object.constructor === loaded.object.constructor
          );

          if (target && target.amount >= loaded.amount) {
            return true;
          }

          let extra = target ? loaded.amount - target.amount : loaded.amount;
          if (extra > this.intakeInTurn - ammoTransferredOut) {
            extra = this.intakeInTurn - ammoTransferredOut;
          }

          if (extra === 0) {
            return true;
          }

          const spaceAvailable = cargoService.hasSpaceForHowMany(ship, {
            object: loaded.object,
            amount: extra
          });

          if (spaceAvailable === 0) {
            return true;
          } else if (spaceAvailable < extra) {
            extra = spaceAvailable;
          }

          cargoService.divideCargo(ship, {
            object: loaded.object,
            amount: extra
          });

          ammoTransferredOut += extra;
          loaded.amount -= extra;

          return false;
        })
      ) {
        break;
      }
    }

    this.loaded = this.loaded.filter(entry => entry.amount > 0);

    while (true) {
      if (ammoTransferredIn === this.intakeInTurn) {
        break;
      }

      if (
        this.targetLoad.every(target => {
          let loaded = this.loaded.find(
            loaded => target.object.constructor === loaded.object.constructor
          );

          if (!loaded && target.amount > 0) {
            loaded = {
              object: target.object,
              amount: 0
            };

            this.loaded.push(loaded);
          } else if (!loaded && target.amount === 0) {
            return true;
          }

          if (loaded.amount >= target.amount) {
            return true;
          }

          const cargoSystem = this.system.shipSystems
            .getSystems()
            .find(system =>
              system.callHandler("getCargoEntry", target.object, null)
            );

          if (!cargoSystem) {
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
              object: cargo.object,
              amount: missing
            });
            ammoTransferredIn += missing;
          } else if (cargo.amount < missing) {
            loaded.amount += cargo.amount;
            cargoSystem.callHandler("removeCargo", {
              object: cargo.object,
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

    this._changeSelectedAmmoIfOutOfAmmo();
  }
}

export default AmmunitionStrategy;
