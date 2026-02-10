import { cargoClasses } from "./cargo";
export const createCargoInstance = (className) => {
    if (!cargoClasses[className]) {
        throw new Error(`Unrecognized cargo name "${className}"`);
    }
    //@ts-ignore
    return new cargoClasses[className]();
};
export const cloneCargoEntity = (entity) => createCargoInstance(entity.getCargoClassName());
