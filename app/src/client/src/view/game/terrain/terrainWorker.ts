import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { Offset } from "@fieryvoid3/model/src/hexagon";
import { getHeightAt, getTextureAt } from "./terrainDataMock";

interface DeformRequest {
  gridX: number;
  gridY: number;
  vertexCount: number;
  positions: Float32Array;
  originX: number;
  originY: number;
  gridSize: number;
}

interface DeformResponse {
  gridX: number;
  gridY: number;
  positions: Float32Array;
  textureData: Uint8Array;
  textureSize: number;
}

self.onmessage = (e: MessageEvent<DeformRequest>) => {
  const { gridX, gridY, vertexCount, positions, originX, originY, gridSize } =
    e.data;

  // Process vertex heights
  for (let i = 0; i < vertexCount; i++) {
    // Convert local coordinates to world coordinates
    const worldX = positions[i * 3] + originX;
    const worldY = positions[i * 3 + 1] + originY;

    const hexOffset = coordinateConverter.fromGameToHex({
      x: worldX,
      y: worldY,
      z: 1,
    });

    const neighbors = [hexOffset, ...hexOffset.getNeighbours()];

    let totalWeight = 0;
    let weightedHeight = 0;

    neighbors.forEach((neighbor) => {
      const neighborCenter = coordinateConverter.fromHexToGame(neighbor);
      const dx = worldX - neighborCenter.x;
      const dy = worldY - neighborCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const weight = distance < 0.01 ? 1000 : 1 / (distance * distance);
      const height = getHeightAt(neighbor);

      weightedHeight += height * weight;
      totalWeight += weight;
    });

    const interpolatedHeight =
      totalWeight > 0 ? weightedHeight / totalWeight : 0;
    positions[i * 3 + 2] = interpolatedHeight * 50;
  }

  // Generate texture lookup image
  // gridSize + 2 for the border hexes
  const textureSize = gridSize + 2;
  const textureData = new Uint8Array(textureSize * textureSize);

  // Local offset starts at -1 (border hex)
  const localOffsetQ = -1;
  const localOffsetR = -1;

  for (let q = 0; q < textureSize; q++) {
    for (let r = 0; r < textureSize; r++) {
      const localQ = q + localOffsetQ;
      const localR = r + localOffsetR;

      // Convert to world hex coordinates
      const worldQ = localQ + gridX * gridSize;
      const worldR = localR + gridY * gridSize;

      const textureId = getTextureAt(new Offset(worldQ, worldR));
      if (textureId === 1) {
        console.log("texture id is 1 at ", r, q, "world:", worldQ, worldR);
      }
      textureData[r * textureSize + q] = textureId;
    }
  }

  const response: DeformResponse = {
    gridX,
    gridY,
    positions,
    textureData,
    textureSize,
  };

  (self as unknown as Worker).postMessage(response, [
    positions.buffer,
    textureData.buffer,
  ]);
};
