import Ship, { SerializedShip } from "./Ship";
import ships from "./ships/index";

export const createShipObject = (data: SerializedShip): Ship => {
  const { shipClass } = data;
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  try {
    // @ts-expect-error
    return new ships[shipClass](data);
  } catch (e) {
    console.error(`Unable to construct ship of class "${shipClass}"`);
    throw e;
  }
};

export const createBareShipObject = (data: SerializedShip) => {
  const { shipClass } = data;
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  try {
    // @ts-expect-error
    return new ships[shipClass]();
  } catch (e) {
    console.error(`Unable to construct plain ship of class "${shipClass}"`);
    throw e;
  }
};
