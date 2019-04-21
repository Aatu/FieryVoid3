import ships from "./ships";

export const createShipObject = data => {
  const { shipClass } = data;
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  return new ships[shipClass](data);
};

export const createBareShipObject = data => {
  const { shipClass } = data;
  if (!shipClass) {
    throw new Error("Ship class missing, can not construct a ship");
  }

  return new ships[shipClass]();
};
