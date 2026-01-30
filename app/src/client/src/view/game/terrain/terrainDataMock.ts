import { Offset } from "@fieryvoid3/model/src/hexagon";
import PerlinNoise from "./perlinNoise";

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

export const getHeightAt = (hex: Offset): number => {
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

export const getHeightAt3 = (hex: Offset): number => {
  const scale = 0.05;
  const octaves = 4;
  const persistence = 0.5;

  const height = perlin.octaveNoise(
    hex.q * scale,
    hex.r * scale,
    octaves,
    persistence,
  );

  return (height + 1) * 5;
};

export const getTextureAt = (hex: Offset): number => {
  if (hex.equals({ q: 7, r: 3 }) || hex.equals({ q: 0, r: -1 })) {
    return 1;
  }

  if (hex.equals({ q: 74, r: 3 })) {
    return 1;
  }

  if (hex.equals({ q: 53, r: 63 })) {
    return 1;
  }

  return 0;
};
