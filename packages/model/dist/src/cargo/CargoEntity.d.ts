import { CargoType } from "../unit/system/cargo/cargo";
import { SystemMessage } from "../unit/system/strategy/types/SystemHandlersTypes";
export interface ICargoEntity {
    getSpaceRequired(): number;
    getCargoInfo(): SystemMessage[];
    getDisplayName(): string;
    getShortDisplayName(): string;
    getBackgroundImage(): string;
}
declare class CargoEntity implements ICargoEntity {
    getCargoClassName(): CargoType;
    getSpaceRequired(): number;
    getCargoInfo(): SystemMessage[];
    getDisplayName(): string;
    getShortDisplayName(): string;
    getBackgroundImage(): string;
    isInstanceOf(other: CargoEntity | null): boolean;
    equals(other?: CargoEntity | null): boolean;
}
export default CargoEntity;
