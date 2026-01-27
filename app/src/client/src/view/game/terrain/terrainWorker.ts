import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { getHeightAt } from "./terrainDataMock";

interface DeformRequest {
  gridX: number;
  gridY: number;
  spacingWidth: number;
  spacingHeight: number;
  vertexCount: number;
  positions: Float32Array;
}

interface DeformResponse {
  gridX: number;
  gridY: number;
  positions: Float32Array;
}

self.onmessage = (e: MessageEvent<DeformRequest>) => {
  const { gridX, gridY, spacingWidth, spacingHeight, vertexCount, positions } = e.data;

  const planeWorldX = gridX * spacingWidth;
  const planeWorldY = gridY * spacingHeight;

  for (let i = 0; i < vertexCount; i++) {
    const localX = positions[i * 3];
    const localY = positions[i * 3 + 1];

    const worldX = planeWorldX + localX;
    const worldY = planeWorldY + localY;

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
