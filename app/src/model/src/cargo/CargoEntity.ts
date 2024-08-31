import { CargoType, createCargoInstance } from "../unit/system/cargo/cargo";
import { SystemMessage } from "../unit/system/strategy/types/SystemHandlersTypes";

export interface ICargoEntity {
  getSpaceRequired(): number;
  getCargoInfo(): SystemMessage[];
  getDisplayName(): string;
  getShortDisplayName(): string;
  getBackgroundImage(): string;
}

class CargoEntity implements ICargoEntity {
  getCargoClassName(): CargoType {
    return this.constructor.name as CargoType;
  }

  getSpaceRequired() {
    return 0.1;
  }

  getCargoInfo(): SystemMessage[] {
    return [];
  }

  getDisplayName() {
    return "";
  }

  getShortDisplayName() {
    return "";
  }

  getBackgroundImage() {
    return "";
  }

  clone() {
    return createCargoInstance<typeof this>(this.getCargoClassName());
  }

  isInstanceOf(other: CargoEntity | null) {
    if (!other) {
      return false;
    }

    return this instanceof other.constructor;
  }

  equals(other?: CargoEntity | null) {
    if (!other) {
      return false;
    }

    return this.constructor.name === other.constructor.name;
  }
}

export default CargoEntity;
