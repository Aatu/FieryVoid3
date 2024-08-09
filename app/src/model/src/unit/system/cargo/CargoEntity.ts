import { SystemMessage } from "../strategy/types/SystemHandlersTypes";
import { CargoType } from "./cargo";

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
