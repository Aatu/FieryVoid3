import ShipSystemStrategy from "../ShipSystemStrategy";
import CargoService, { CargoEntry } from "../../../../cargo/CargoService";
import Ammo from "../../weapon/ammunition/Ammo";
import { AmmunitionType, createAmmoInstance } from "../../weapon/ammunition";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import Ship from "../../../Ship";
import ShipSystem from "../../ShipSystem";

export type SerializedAmmunitionStrategy = {
  ammunitionStrategy: {
    targetLoad: { className: AmmunitionType; amount: number }[];
    loaded: { className: AmmunitionType; amount: number }[];
    changeTargetLoad: { className: AmmunitionType; amount: number }[] | null;
    turnsOffline: number;
    selectedAmmo: AmmunitionType;
    changeSelectedAmmo: AmmunitionType | null;
  };
};

class AmmunitionStrategy extends ShipSystemStrategy {
  public ammunitionClasses: AmmunitionType[];
  public capacity: number;
  public intakeInTurn: number;
  public startLoadingAfter: number;
  public ammoPerFireOrder: number;
  public selectedAmmo: Ammo;
  public turnsOffline: number;
  public targetLoad: { object: Ammo; amount: number }[];
  public changeTargetLoad: CargoEntry<Ammo>[] | null;
  public changeSelectedAmmo: Ammo | null;
  public loaded: { object: Ammo; amount: number }[];

  constructor(
    ammunitionClasses: AmmunitionType[],
    ammoPerFireOrder: number,
    capacity: number,
    intakeInTurn: number,
    startLoadingAfter = 1
  ) {
    super();

    this.ammunitionClasses = ammunitionClasses;
    this.capacity = capacity;
    this.startLoadingAfter = startLoadingAfter;
    this.intakeInTurn = intakeInTurn;
    this.ammoPerFireOrder = ammoPerFireOrder;

    this.selectedAmmo = createAmmoInstance(
      this.ammunitionClasses[this.ammunitionClasses.length - 1]
    );

    this.turnsOffline = 0;
    this.targetLoad = this.buildInitialTargetLoad();

    this.changeTargetLoad = null;
    this.changeSelectedAmmo = null;

    this.loaded = [];
  }

  private buildInitialTargetLoad() {
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
        object: createAmmoInstance(className),
        amount,
      };
    });
  }

  getIconText(payload: unknown, previousResponse = "") {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    if (
      this.getSystem().callHandler(SYSTEM_HANDLERS.isLoaded, null, null) ===
      false
    ) {
      return previousResponse;
    }

    return this.getSelectedAmmo().getIconText();
  }

  getUiComponents({ myShip }: { myShip: boolean }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.getSystem().isDestroyed()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        name: "Ammo",
        props: {
          ammoStrategy: this,
        },
      },
    ];
  }

  getTooltipMenuButton({ myShip }: { myShip: boolean }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        img: this.getSelectedAmmo().getBackgroundImage(),
        onClickHandler: () => {
          this.toggleSelectedAmmo();
        },
        onDisabledHandler: () => false,
      },
    ];
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedAmmunitionStrategy {
    return {
      ...previousResponse,
      ammunitionStrategy: {
        targetLoad: this.targetLoad.map((entry) => ({
          className: entry.object.getConstructorName(),
          amount: entry.amount,
        })),
        loaded: this.loaded.map((entry) => ({
          className: entry.object.getConstructorName(),
          amount: entry.amount,
        })),
        changeTargetLoad: this.changeTargetLoad
          ? this.changeTargetLoad.map((entry) => ({
              className: entry.object.getConstructorName(),
              amount: entry.amount,
            }))
          : null,
        turnsOffline: this.turnsOffline,
        selectedAmmo: this.selectedAmmo.getConstructorName(),
        changeSelectedAmmo: this.changeSelectedAmmo
          ? this.changeSelectedAmmo.getConstructorName()
          : null,
      },
    };
  }

  deserialize(data: SerializedAmmunitionStrategy) {
    const ammoData = data.ammunitionStrategy || {};
    this.targetLoad = ammoData.targetLoad
      ? ammoData.targetLoad.map((entry) => ({
          object: createAmmoInstance(entry.className),
          amount: entry.amount,
        }))
      : [];

    this.loaded = ammoData.loaded
      ? ammoData.loaded.map((entry) => ({
          object: createAmmoInstance(entry.className),
          amount: entry.amount,
        }))
      : [];

    this.changeTargetLoad = ammoData.changeTargetLoad
      ? ammoData.changeTargetLoad.map((entry) => ({
          object: createAmmoInstance(entry.className),
          amount: entry.amount,
        }))
      : null;

    this.turnsOffline = ammoData.turnsOffline || 0;

    this.selectedAmmo = ammoData.selectedAmmo
      ? createAmmoInstance(ammoData.selectedAmmo)
      : createAmmoInstance(
          this.ammunitionClasses[this.ammunitionClasses.length - 1]
        );

    this.changeSelectedAmmo = ammoData.changeSelectedAmmo
      ? createAmmoInstance(ammoData.changeSelectedAmmo)
      : null;

    return this;
  }

  toggleSelectedAmmo() {
    let index: number = 0;
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

  addToLoading({ object, amount }: CargoEntry<Ammo>) {
    if (!this.changeTargetLoad) {
      this.changeTargetLoad = this.targetLoad.map((entry) => ({
        ...entry,
      }));
    }

    let entry = this.changeTargetLoad.find(
      (entry) => entry.object.constructor === object.constructor
    );

    if (!entry && amount > 0) {
      entry = {
        object,
        amount: 0,
      };

      this.changeTargetLoad.push(entry);
    } else if (!entry && amount < 0) {
      return;
    }

    if (this.getLoadingTargetAmount() + amount > this.capacity) {
      return;
    }

    if (!entry || entry.amount + amount < 0) {
      return;
    }

    entry.amount += amount;
  }

  setNewLoadingTarget(target: CargoEntry<Ammo>[] | null) {
    this.changeTargetLoad = target;
  }

  setNewSelectedAmmo(ammo: Ammo | null) {
    this.changeSelectedAmmo = ammo;
  }

  receivePlayerData({
    clientShip,
    clientSystem,
  }: {
    clientShip: Ship;
    clientSystem: ShipSystem;
  }) {
    if (!clientSystem) {
      return;
    }

    if (this.getSystem().power.isOffline()) {
      //this is fine
    } else if (this.getSystem().isDisabled()) {
      return;
    }

    const clientStrategy =
      clientSystem.getStrategiesByInstance<AmmunitionStrategy>(
        AmmunitionStrategy
      )[0];
    const changeTargetLoad = clientStrategy.changeTargetLoad;
    const changeSelectedAmmo = clientStrategy.changeSelectedAmmo;

    if (changeTargetLoad) {
      changeTargetLoad.forEach((entry) => {
        if (
          !this.ammunitionClasses.some(
            (className) => entry.object.getCargoClassName() === className
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
          (ammoClass) => changeSelectedAmmo.getCargoClassName() === ammoClass
        )
      ) {
        throw new Error(
          `Illegal selected ammo: '${changeSelectedAmmo.constructor.name}'`
        );
      }

      this.selectedAmmo = changeSelectedAmmo;
    }
  }

  shouldBeOffline(payload: unknown, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    return this.loaded.every(({ amount }) => amount < this.ammoPerFireOrder);
  }

  canFire(payload: unknown, previousResponse = true) {
    const entry = this.loaded.find(
      (load) => load.object.constructor === this.selectedAmmo.constructor
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
      (load) => load.object.constructor === this.selectedAmmo.constructor
    );

    if (!entry) {
      throw new Error(
        "Seems like you fired a weapon without ammo. That is not good"
      );
    }

    entry.amount -= this.ammoPerFireOrder;

    this.getSystem()
      .log.getGenericLogEntry()
      .addMessage(
        `Expended ordnance: ${
          this.ammoPerFireOrder
        } x ${this.selectedAmmo.getDisplayName()}`
      );

    this.loaded = this.loaded.filter((entry) => entry.amount > 0);
    this.changeSelectedAmmoIfOutOfAmmo();
  }

  advanceTurn() {
    if (this.getSystem().power.isOffline()) {
      this.turnsOffline++;
    } else if (this.getSystem().isDisabled()) {
      return;
    } else {
      this.turnsOffline = 0;
    }

    if (this.turnsOffline > this.startLoadingAfter) {
      this.load();
    }
  }

  private changeSelectedAmmoIfOutOfAmmo() {
    if (this.loaded.length === 0) {
      return;
    }

    if (
      !this.loaded.find(
        (load) => load.object.constructor === this.selectedAmmo.constructor
      )
    ) {
      const newAmmo = this.loaded.find(
        (entry) => entry.amount > this.ammoPerFireOrder
      );

      if (newAmmo) {
        this.selectedAmmo = newAmmo.object;
      }
    }
  }

  private load() {
    let ammoTransferredIn = 0;
    let ammoTransferredOut = 0;

    const ship = this.getSystem().getShipSystems().ship;
    const cargoService = new CargoService();

    while (true) {
      if (ammoTransferredOut === this.intakeInTurn) {
        break;
      }

      if (
        this.loaded.every((loaded) => {
          const target = this.targetLoad.find(
            (target) => target.object.constructor === loaded.object.constructor
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
            amount: extra,
          });

          if (spaceAvailable === 0) {
            return true;
          } else if (spaceAvailable < extra) {
            extra = spaceAvailable;
          }

          cargoService.divideCargo(ship, {
            object: loaded.object,
            amount: extra,
          });

          ammoTransferredOut += extra;
          loaded.amount -= extra;

          return false;
        })
      ) {
        break;
      }
    }

    this.loaded = this.loaded.filter((entry) => entry.amount > 0);

    while (true) {
      if (ammoTransferredIn === this.intakeInTurn) {
        break;
      }

      if (
        this.targetLoad.every((target) => {
          let loaded = this.loaded.find(
            (loaded) => target.object.constructor === loaded.object.constructor
          );

          if (!loaded && target.amount > 0) {
            loaded = {
              object: target.object,
              amount: 0,
            };

            this.loaded.push(loaded);
          } else if (!loaded && target.amount === 0) {
            return true;
          }

          if (loaded && loaded.amount >= target.amount) {
            return true;
          }

          const cargoSystem = this.getSystem()
            .getShipSystems()
            .getSystems()
            .find((system) =>
              system.callHandler(
                SYSTEM_HANDLERS.getCargoEntry,
                target.object,
                null
              )
            );

          if (!cargoSystem) {
            return true;
          }

          const cargo = cargoSystem.callHandler(
            SYSTEM_HANDLERS.getCargoEntry,
            target.object,
            null as CargoEntry<Ammo> | null
          );

          if (!loaded) {
            return;
          }

          let missing = target.amount - loaded.amount;

          if (missing > this.intakeInTurn - ammoTransferredIn) {
            missing = this.intakeInTurn - ammoTransferredIn;
          }

          if (cargo && cargo.amount >= missing) {
            loaded.amount += missing;
            cargoSystem.callHandler(
              SYSTEM_HANDLERS.removeCargo,
              {
                object: cargo.object,
                amount: missing,
              },
              undefined
            );
            ammoTransferredIn += missing;
          } else if (cargo && cargo.amount < missing) {
            loaded.amount += cargo.amount;
            cargoSystem.callHandler(
              SYSTEM_HANDLERS.removeCargo,
              {
                object: cargo.object,
                amount: cargo.amount,
              },
              undefined
            );
            ammoTransferredIn += cargo.amount;
          }

          return false;
        })
      ) {
        break;
      }
    }

    this.loaded = this.loaded.filter((entry) => entry.amount > 0);
    this.changeSelectedAmmoIfOutOfAmmo();
  }
}

export default AmmunitionStrategy;
