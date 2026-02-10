import { createCargoInstance } from "../unit/system/cargo/createCargoInstance";
import * as Yup from "yup";
export class CargoEntry {
    object;
    amount;
    constructor(object, amount = 1) {
        this.object = object;
        this.amount = amount;
    }
    clone() {
        return CargoEntry.deserialize(this.serialize());
    }
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    flipAmount() {
        this.amount = this.amount * -1;
        return this;
    }
    serialize() {
        return {
            className: this.object.getCargoClassName(),
            amount: this.amount,
        };
    }
    static deserialize(data) {
        if (!schema.isValidSync(data)) {
            throw new Error("Invalid cargo entry");
        }
        const cargoObject = createCargoInstance(data.className);
        return new CargoEntry(cargoObject, data.amount);
    }
    toString() {
        return `${this.object.getCargoClassName()} x ${this.amount}`;
    }
}
const schema = Yup.object().shape({
    className: Yup.string().required(),
    amount: Yup.number().required().integer(),
});
