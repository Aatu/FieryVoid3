import { SystemMessage } from "../strategy/types/SystemHandlersTypes";

export interface ICargoEntity {
  getSpaceRequired(): number;
  getCargoInfo(): SystemMessage[];
  getDisplayName(): string;
  getShortDisplayName(): string;
  getBackgroundImage(): string;
}

class CargoEntity implements ICargoEntity {
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
}

export default CargoEntity;
