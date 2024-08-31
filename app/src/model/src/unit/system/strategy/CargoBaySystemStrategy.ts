import ShipSystemStrategy from "./ShipSystemStrategy";
import { CargoType } from "../cargo/cargo";
import { CargoEntry, SerializedCargoEntry } from "../../../cargo/CargoEntry";
import CargoEntity from "../../../cargo/CargoEntity";
import Ship from "../../Ship";
import ShipSystem from "../ShipSystem";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";

export type SerializedCargoBaySystemStrategy = {
  cargoBaySystemStrategy?: {
    cargo: SerializedCargoEntry[];
    targetCargo: SerializedCargoEntry[] | null;
  };
};

class CargoBaySystemStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  protected space: number;
  protected cargo: CargoEntry[];
  protected timeToMoveTo: number = 10;
  protected allowedCargoClasses: CargoType[] | null = null;
  protected targetCargo: CargoEntry[] | null = null;
  protected supply: boolean = true;
  protected allowCargoTransferOnline: boolean = true;

  constructor(
    space: number,
    timeToMoveTo?: number,
    allowedCargoClasses?: CargoType[],
    supply?: boolean,
    allowCargoTransferOnline?: boolean
  ) {
    super();
    this.space = space;
    this.cargo = [];
    this.timeToMoveTo = timeToMoveTo ?? this.timeToMoveTo;
    this.allowedCargoClasses = allowedCargoClasses || null;
    this.supply = supply ?? true;
    this.allowCargoTransferOnline = allowCargoTransferOnline ?? true;
  }

  getUiComponents(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,
      {
        name: "CargoList",
        props: {
          list: this.cargo.map((cargo) => ({
            object: cargo.object,
            amount: cargo.amount,
          })),
        },
      },
    ];
  }

  serialize(
    payload: unknown,
    previousResponse = {}
  ): SerializedCargoBaySystemStrategy {
    return {
      ...previousResponse,
      cargoBaySystemStrategy: {
        cargo: this.cargo.map((cargo) => cargo.serialize()),
        targetCargo: this.targetCargo
          ? this.targetCargo.map((c) => c.serialize())
          : null,
      },
    };
  }

  deserialize(data: SerializedCargoBaySystemStrategy = {}) {
    const systemData = data?.cargoBaySystemStrategy;

    this.cargo = systemData?.cargo.map((c) => CargoEntry.deserialize(c)) ?? [];
    this.targetCargo =
      systemData?.targetCargo?.map((c) => CargoEntry.deserialize(c)) ?? null;

    return this;
  }

  public getTimeToMoveCargoTo() {
    return this.timeToMoveTo;
  }

  public getTotalCargoSpace() {
    return this.space;
  }

  public getAvailableCargoSpace() {
    return this.space - this.getCargoSpaceUsed();
  }

  public getTargetCargo() {
    return this.targetCargo;
  }

  public setTargetCargo(cargo: CargoEntry[] | null) {
    this.targetCargo = cargo ? [...cargo.map((c) => c.clone())] : null;
    return this;
  }

  public getAllCargo() {
    return this.cargo.map((c) => c.clone());
  }

  public getCargoSpaceUsed() {
    return this.cargo.reduce(
      (total, { object, amount }) => total + object.getSpaceRequired() * amount,
      0
    );
  }

  public getCargoEntry(object: CargoEntity): CargoEntry | null {
    if (this.getSystem().isDestroyed()) {
      return null;
    }

    return (
      this.cargo.find(
        (stored) => stored.object.constructor === object.constructor
      ) || null
    );
  }

  public getCargoByParentClass(parentClass: typeof CargoEntity) {
    if (this.getSystem().isDestroyed()) {
      return [];
    }

    return this.cargo.filter((cargo) => cargo.object instanceof parentClass);
  }

  public currentlyAcceptsCargoTransfers() {
    if (!this.allowCargoTransferOnline && this.getSystem().power.isOnline()) {
      return false;
    }

    return true;
  }

  public isAllowedCargo(cargo: CargoEntry) {
    return (
      !this.allowedCargoClasses ||
      !this.allowedCargoClasses.includes(cargo.object.getCargoClassName())
    );
  }

  public useCargoForSupply() {
    return this.supply;
  }

  public removeAllCargo() {
    this.cargo = [];
  }

  public removeCargo(cargo: CargoEntry) {
    const entry = this.getCargoEntry(cargo.object);

    if (!entry || entry.amount < cargo.amount) {
      throw new Error("Check hasCargo first!");
    }

    entry.amount -= cargo.amount;

    this.cargo = this.cargo.filter((entry) => entry.amount > 0);
  }

  public addCargo(cargo: CargoEntry | CargoEntry[]) {
    ([] as CargoEntry[]).concat(cargo).forEach((cargo) => {
      let entry = this.getCargoEntry(cargo.object);

      if (entry) {
        entry.amount += cargo.amount;
      } else {
        this.cargo.push(cargo.clone());
      }
    });
  }

  public isCargoBay() {
    return true;
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
      clientSystem.getStrategiesByInstance<CargoBaySystemStrategy>(
        CargoBaySystemStrategy
      )[0];

    const changeTargetCargo = clientStrategy.targetCargo;
    if (changeTargetCargo === null && this.targetCargo !== null) {
      return;
    }

    if (changeTargetCargo?.some((c) => !this.isAllowedCargo(c))) {
      return;
    }

    this.targetCargo = changeTargetCargo;
  }

  public loadTargetCargoInstant() {
    if (!this.targetCargo) {
      return;
    }

    this.cargo = this.targetCargo.map((c) => c.clone());
  }
}

export default CargoBaySystemStrategy;
