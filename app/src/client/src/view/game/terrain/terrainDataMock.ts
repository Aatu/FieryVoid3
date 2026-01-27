import { Offset } from "@fieryvoid3/model/src/hexagon";

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
  if (hex.q == 0 && hex.r == 0) {
    return 1;
  }

  if (hex.equals({ q: -3, r: 31 })) {
    return 1;
  }

  return 0;
};
