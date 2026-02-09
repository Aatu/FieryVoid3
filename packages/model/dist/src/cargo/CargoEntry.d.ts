import { CargoType } from "../unit/system/cargo/cargo";
import CargoEntity from "./CargoEntity";
export type SerializedCargoEntry = {
    className: CargoType;
    amount: number;
};
export declare class CargoEntry<T extends CargoEntity = CargoEntity> {
    object: T;
    amount: number;
    constructor(object: T, amount?: number);
    clone(): CargoEntry<CargoEntity>;
    setAmount(amount: number): this;
    flipAmount(): this;
    serialize(): {
        className: "Torpedo158MSV2" | "Torpedo158MSV" | "Torpedo158Nuclear" | "Torpedo72MSV" | "Torpedo72HE" | "Torpedo158HE" | "Ammo30mm" | "Ammo85mmHE" | "Ammo85mmAP" | "Ammo140mmAP" | "Ammo140mmHE" | "Ammo120mmAP" | "Ammo120mmHE";
        amount: number;
    };
    static deserialize(data: SerializedCargoEntry): CargoEntry;
    toString(): string;
}
