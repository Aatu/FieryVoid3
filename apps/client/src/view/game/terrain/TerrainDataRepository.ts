import { Offset } from "@fieryvoid3/model/src/hexagon";
import { getHeightAt } from "./terrainDataMock";

export class TerrainDataRepository {
  constructor() {}

  public getTerrainHeightData(hexCoordinate: Offset): number {
    return getHeightAt(hexCoordinate);
  }
}
