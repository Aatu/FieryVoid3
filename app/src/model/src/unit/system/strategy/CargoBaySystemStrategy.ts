import ShipSystemStrategy from "./ShipSystemStrategy";
import { CargoType } from "../cargo/cargo";
import { CargoEntry, SerializedCargoEntry } from "../../../cargo/CargoEntry";
import CargoEntity from "../../../cargo/CargoEntity";
import Ship from "../../Ship";
import ShipSystem from "../ShipSystem";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";
import { addCargos, cargoContains, subtractCargos } from "../../ShipCargo";

export type SerializedCargoBaySystemStrategy = {
  cargoBaySystemStrategy?: {
    cargo: SerializedCargoEntry[];
  };
};

class CargoBaySystemStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  protected space: number;
  protected cargo: CargoEntry[];
  protected allowedCargoClasses: CargoType[] | null = null;

  constructor(space: number, allowedCargoClasses?: CargoType[]) {
    super();
    this.space = space;
    this.cargo = [];
    this.allowedCargoClasses = allowedCargoClasses || null;
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
      },
    };
  }

  deserialize(data: SerializedCargoBaySystemStrategy = {}) {
    const systemData = data?.cargoBaySystemStrategy;

    this.cargo = systemData?.cargo.map((c) => CargoEntry.deserialize(c)) ?? [];

    return this;
  }

  public getTotalCargoSpace() {
    return this.space;
  }

  public getAvailableCargoSpace() {
    return this.space - this.getCargoSpaceUsed();
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

  public isAllowedCargo(cargo: CargoEntry) {
    return (
      !this.allowedCargoClasses ||
      !this.allowedCargoClasses.includes(cargo.object.getCargoClassName())
    );
  }

  public hasCargo(payload: CargoEntry[] | CargoEntry): boolean {
    payload = ([] as CargoEntry[]).concat(payload);

    return cargoContains(this.cargo, payload);
  }

  public removeAllCargo() {
    this.cargo = [];
  }

  public removeCargo(cargo: CargoEntry | CargoEntry[]) {
    cargo = ([] as CargoEntry[]).concat(cargo);

    console.log("REMOVING CARGO from", this.getSystem().id);

    console.log(
      "Current cargo",
      this.cargo.map((c) => c.toString()).join(", ")
    );
    console.log("removing cargo", cargo.map((c) => c.toString()).join(", "));

    const newCargo = subtractCargos(this.cargo, cargo);
    console.log("New cargo", newCargo.map((c) => c.toString()).join(", "));

    this.cargo = newCargo.filter((c) => c.amount <= 0);
  }

  public addCargo(cargo: CargoEntry | CargoEntry[]) {
    cargo = ([] as CargoEntry[]).concat(cargo);

    console.log("ADDING CARGO to", this.getSystem().id);
    console.log(
      "Current cargo",
      this.cargo.map((c) => c.toString()).join(", ")
    );
    console.log("Adding cargo", cargo.map((c) => c.toString()).join(", "));

    const newCargo = addCargos(this.cargo, cargo);
    console.log("New cargo", newCargo.map((c) => c.toString()).join(", "));

    this.cargo = newCargo;
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

    //TODO: system to allow player to move cargo
  }
}

export default CargoBaySystemStrategy;
