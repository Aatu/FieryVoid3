import * as gameConfig from "../gameConfig.mjs";

const getHexA = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return hexSize * Math.sin((30 / 180) * Math.PI);
};

const getHexB = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return hexSize * Math.cos((30 / 180) * Math.PI);
};

const getHexHeight = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return hexSize + 2 * getHexA(hexSize);
};

const getHexWidth = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return getHexB(hexSize) * 2;
};

const getHexRowHeight = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return hexSize + getHexA(hexSize);
};

const getTextureHeight = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return Math.floor(hexSize + getHexHeight(hexSize));
};

const getTextureWidth = hexSize => {
  if (!hexSize) {
    hexSize = gameConfig.HEX_SIZE;
  }

  return getHexWidth(hexSize) * 2;
};

const getGridWidth = hexCountWidth => {
  return getHexWidth() * (hexCountWidth + 0.5);
};

const getGridHeight = hexCountHeight => {
  var amount = Math.floor(hexCountHeight / 2);
  var height = amount * (getHexHeight() + gameConfig.HEX_SIZE);

  if (hexCountHeight % 2 !== 0) {
    height += getHexHeight();
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
  getGridHeight
};
