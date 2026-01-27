import * as THREE from "three";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";
import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { Offset } from "@fieryvoid3/model/src/hexagon";

interface HexVertex {
  worldX: number;
  worldY: number;
  index: number;
  hexQ: number;
  hexR: number;
  isCenter: boolean;
}

export class HexGeometry extends THREE.BufferGeometry {
  private hexVertexMap: Map<string, HexVertex> = new Map();
  private gridWidth: number;
  private gridHeight: number;
  private offsetX: number;
  private offsetY: number;
  public readonly originX: number;
  public readonly originY: number;

  constructor(
    gridWidth: number,
    gridHeight: number,
    offsetX: number,
    offsetY: number
  ) {
    super();
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    // Calculate the origin (world position of the first hex in this grid)
    const originHex = new Offset(offsetX, offsetY);
    const originWorld = coordinateConverter.fromHexToGame(originHex);
    this.originX = originWorld.x;
    this.originY = originWorld.y;

    this.buildHexMesh();
  }

  private buildHexMesh() {
    const vertices: number[] = [];
    const indices: number[] = [];
    const vertexList: HexVertex[] = [];

    // Create vertices for each hex
    for (let q = 0; q < this.gridWidth; q++) {
      for (let r = 0; r < this.gridHeight; r++) {
        const hex = new Offset(q + this.offsetX, r + this.offsetY);
        const centerWorld = coordinateConverter.fromHexToGame(hex);

        // Convert to local coordinates relative to mesh origin
        const center = {
          x: centerWorld.x - this.originX,
          y: centerWorld.y - this.originY,
        };

        // Add center vertex
        const centerKey = `c_${q}_${r}`;
        const centerVertex: HexVertex = {
          worldX: centerWorld.x,  // Keep world coords for worker
          worldY: centerWorld.y,
          index: vertexList.length,
          hexQ: hex.q,
          hexR: hex.r,
          isCenter: true,
        };
        this.hexVertexMap.set(centerKey, centerVertex);
        vertexList.push(centerVertex);
        vertices.push(center.x, center.y, 0);  // Use local coords for geometry

        // Add corner vertices
        const corners = this.getHexCorners(center.x, center.y);
        for (let i = 0; i < 6; i++) {
          const cornerWorldX = corners[i].x + this.originX;
          const cornerWorldY = corners[i].y + this.originY;
          // Use world coordinates for the key so adjacent hexes share vertices
          const cornerKey = `corner_${Math.round(cornerWorldX * 1000)}_${Math.round(cornerWorldY * 1000)}`;

          // Check if this corner already exists (shared with adjacent hex)
          let cornerVertex = this.hexVertexMap.get(cornerKey);

          if (!cornerVertex) {
            cornerVertex = {
              worldX: cornerWorldX,  // Store world coords for worker
              worldY: cornerWorldY,
              index: vertexList.length,
              hexQ: hex.q,
              hexR: hex.r,
              isCenter: false,
            };
            this.hexVertexMap.set(cornerKey, cornerVertex);
            vertexList.push(cornerVertex);
            vertices.push(corners[i].x, corners[i].y, 0);  // Use local coords for geometry
          }

          // Create triangle: center -> corner[i] -> corner[(i+1)%6]
          const nextCorner = corners[(i + 1) % 6];
          const nextCornerWorldX = nextCorner.x + this.originX;
          const nextCornerWorldY = nextCorner.y + this.originY;
          const nextCornerKey = `corner_${Math.round(nextCornerWorldX * 1000)}_${Math.round(nextCornerWorldY * 1000)}`;
          let nextCornerVertex = this.hexVertexMap.get(nextCornerKey);

          if (!nextCornerVertex) {
            nextCornerVertex = {
              worldX: nextCornerWorldX,  // Store world coords for worker
              worldY: nextCornerWorldY,
              index: vertexList.length,
              hexQ: hex.q,
              hexR: hex.r,
              isCenter: false,
            };
            this.hexVertexMap.set(nextCornerKey, nextCornerVertex);
            vertexList.push(nextCornerVertex);
            vertices.push(nextCorner.x, nextCorner.y, 0);  // Use local coords for geometry
          }

          indices.push(
            centerVertex.index,
            cornerVertex.index,
            nextCornerVertex.index
          );
        }
      }
    }

    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setIndex(indices);
    this.computeVertexNormals();
  }

  private getHexCorners(centerX: number, centerY: number): { x: number; y: number }[] {
    const corners: { x: number; y: number }[] = [];
    const size = HEX_SIZE;

    // Flat-top hexagon corners (starting at 30 degrees)
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i + 30;
      const angleRad = (Math.PI / 180) * angleDeg;
      corners.push({
        x: centerX + size * Math.cos(angleRad),
        y: centerY + size * Math.sin(angleRad),
      });
    }

    return corners;
  }

  getVertexList(): HexVertex[] {
    const vertices: HexVertex[] = [];
    this.hexVertexMap.forEach(v => vertices.push(v));
    return vertices.sort((a, b) => a.index - b.index);
  }
}
