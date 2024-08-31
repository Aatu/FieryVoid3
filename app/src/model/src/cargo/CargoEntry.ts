import { CargoType, createCargoInstance } from "../unit/system/cargo/cargo";
import CargoEntity from "./CargoEntity";
import { CargoBaySystemStrategy } from "../unit/system/strategy";
import * as Yup from "yup";

export type SerializedCargoEntry = {
  className: CargoType;
  amount: number;
};

export class CargoEntry<T extends CargoEntity = CargoEntity> {
  public object: T;
  public amount: number;

  constructor(object: T, amount: number = 1) {
    this.object = object;
    this.amount = amount;
  }

  fitsInto(cargoBay: CargoBaySystemStrategy) {}

  clone() {
    return CargoEntry.deserialize(this.serialize());
  }

  public serialize() {
    return {
      className: this.object.getCargoClassName(),
      amount: this.amount,
    };
  }

  public static deserialize(data: SerializedCargoEntry): CargoEntry {
    if (!schema.isValidSync(data)) {
      throw new Error("Invalid cargo entry");
    }

    const cargoObject = createCargoInstance(data.className);

    return new CargoEntry<typeof cargoObject>(cargoObject, data.amount);
  }
}

const schema = Yup.object().shape({
  className: Yup.string().required(),
  amount: Yup.number().required().integer().positive(),
});
