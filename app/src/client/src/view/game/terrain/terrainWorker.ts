import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { getHeightAt } from "./terrainDataMock";

interface DeformRequest {
  gridX: number;
  gridY: number;
  vertexCount: number;
  positions: Float32Array;
  originX: number;
  originY: number;
}

interface DeformResponse {
  gridX: number;
  gridY: number;
  positions: Float32Array;
}

self.onmessage = (e: MessageEvent<DeformRequest>) => {
  const { gridX, gridY, vertexCount, positions, originX, originY } = e.data;

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

    const interpolatedHeight = totalWeight > 0 ? weightedHeight / totalWeight : 0;
    positions[i * 3 + 2] = interpolatedHeight * 50;
  }

  const response: DeformResponse = {
    gridX,
    gridY,
    positions,
  };

  (self as unknown as Worker).postMessage(response, [positions.buffer]);
};
