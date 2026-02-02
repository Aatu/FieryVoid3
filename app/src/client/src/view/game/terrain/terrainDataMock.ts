import { Offset } from "@fieryvoid3/model/src/hexagon";
import PerlinNoise from "./perlinNoise";
import { getSeededRandomGenerator } from "@fieryvoid3/model/src/utils/math";

const WORLD_SIZE = 64 * 3;
const TOTAL_HEXES = WORLD_SIZE * WORLD_SIZE;

const generateMockTerrainData = (): number[] => {
  const data: number[] = [];

  for (let i = 0; i < TOTAL_HEXES; i++) {
    data.push(Math.random() > 0.5 ? 1 : 0);
  }

  return data;
};

export const terrainDataMock = generateMockTerrainData();

export const getHeightAt2 = (hex: Offset): number => {
  if (hex.q < 0 || hex.q >= WORLD_SIZE || hex.r < 0 || hex.r >= WORLD_SIZE) {
    return 0;
  }

  const index = hex.q * WORLD_SIZE + hex.r;
  return terrainDataMock[index];
};

export const getHeightAt3 = (hex: Offset): number => {
  if (
    hex.equals({ q: 63, r: 0 }) ||
    hex.equals({ q: 0, r: 63 }) ||
    hex.equals({ q: 63, r: 63 })
  ) {
    return 1;
  }

  if (
    hex.equals({ q: 1, r: 0 }) ||
    hex.equals({ q: 0, r: 1 }) ||
    hex.equals({ q: -1, r: 0 }) ||
    hex.equals({ q: 0, r: -1 }) ||
    hex.equals({ q: -1, r: -1 }) ||
    hex.equals({ q: 1, r: 1 })
  ) {
    return 1;
  }

  if (hex.equals({ q: 0, r: 0 })) {
    return 2;
  }

  if (
    hex.equals({ q: -3, r: 31 }) ||
    hex.equals({ q: -1, r: 39 }) ||
    hex.equals({ q: 108, r: 17 })
  ) {
    return 1;
  }

  return 0;
};

const perlin = new PerlinNoise(12345);

export const getHeightAt = (hex: Offset): number => {
  return 0;

  const scale = 0.01;
  const octaves = 4;
  const persistence = 0.5;

  const height =
    perlin.octaveNoise(hex.q * scale, hex.r * scale, octaves, persistence) * 64;

  if (height < 0) {
    return 0;
  }

  return Math.floor(height);
};

export const getTextureAt = (hex: Offset): number => {
  if (hex.equals({ q: 7, r: 3 })) {
    return 21;
  }

  if (hex.equals({ q: 7, r: 4 })) {
    return 5;
  }

  if (hex.equals({ q: 6, r: 4 })) {
    return 2;
  }

  if (hex.equals({ q: 6, r: 3 })) {
    return 4;
  }

  if (hex.equals({ q: 6, r: 2 })) {
    return 3;
  }

  return 0;
};

export const getTextureAt2 = (hex: Offset): number => {
  const getRandom = getSeededRandomGenerator(hex.toString());

  if (getRandom() < 0.05) {
    return 5;
  }

  if (getRandom() < 0.5) {
    return 1;
  }

  return 0;
};
