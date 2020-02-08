import ships from "./ships/index.mjs";

export const createShipObject = data => {
  const { shipClass } = data;

  console.log("haka is ", new ships["Haka"]());
  console.log("ship class is ", shipClass);
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  try {
    return new ships[shipClass](data);
  } catch (e) {
    console.error(`Unable to construct ship of class "${shipClass}"`);
    throw e;
  }
};

export const createBareShipObject = data => {
  const { shipClass } = data;
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  try {
    return new ships[shipClass]();
  } catch (e) {
    console.error(`Unable to construct plain ship of class "${shipClass}"`);
    throw e;
  }
};
