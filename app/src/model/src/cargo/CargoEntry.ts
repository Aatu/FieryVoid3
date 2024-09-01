import { CargoType } from "../unit/system/cargo/cargo";
import { createCargoInstance } from "../unit/system/cargo/createCargoInstance";
import CargoEntity from "./CargoEntity";
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

  clone() {
    return CargoEntry.deserialize(this.serialize());
  }

  public setAmount(amount: number) {
    this.amount = amount;
    return this;
  }

  public flipAmount() {
    this.amount = this.amount * -1;
    return this;
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
  amount: Yup.number().required().integer(),
});
