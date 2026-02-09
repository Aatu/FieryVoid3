import * as gameConfig from "../config/gameConfig";

const getHexA = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return hexSize * Math.sin((30 / 180) * Math.PI);
};

const getHexB = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return hexSize * Math.cos((30 / 180) * Math.PI);
};

const getHexHeight = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return hexSize + 2 * getHexA(hexSize);
};

const getHexWidth = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return getHexB(hexSize) * 2;
};

const getHexRowHeight = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return hexSize + getHexA(hexSize);
};

const getTextureHeight = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE as number;
  }

  return Math.floor(hexSize + getHexHeight(hexSize));
};

const getTextureWidth = (hexSize?: number) => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return getHexWidth(hexSize) * 2;
};

const getGridWidth = (hexCountWidth: number) => {
  return getHexWidth(gameConfig.HEX_SIZE) * (hexCountWidth + 0.5);
};

const getGridHeight = (hexCountHeight: number) => {
  var amount = Math.floor(hexCountHeight / 2);
  var height =
    amount * (getHexHeight(gameConfig.HEX_SIZE) + gameConfig.HEX_SIZE);

  if (hexCountHeight % 2 !== 0) {
    height += getHexHeight(gameConfig.HEX_SIZE);
  }

  return height;
};

export default {
  getHexA,
  getHexB,
  getHexHeight,
  getHexWidth,
  getHexRowHeight,
  getTextureHeight,
  getTextureWidth,
  getGridWidth,
  getGridHeight,
};
