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
  private coreGridWidth: number;
  private coreGridHeight: number;
  private gridWidth: number;
  private gridHeight: number;
  private offsetX: number;
  private offsetY: number;
  public readonly originX: number;
  public readonly originY: number;

  constructor(
    coreGridWidth: number,
    coreGridHeight: number,
    offsetX: number,
    offsetY: number,
  ) {
    super();
    this.coreGridWidth = coreGridWidth;
    this.coreGridHeight = coreGridHeight;

    // Add 1 border on each side (left + right = 2, bottom + top = 2)
    this.gridWidth = coreGridWidth + 2;
    this.gridHeight = coreGridHeight + 2;

    // Start 1 hex before the offset to create left and bottom borders
    this.offsetX = offsetX - 1;
    this.offsetY = offsetY - 1;

    // Calculate the origin (world position of the first hex in this grid)
    const originHex = new Offset(this.offsetX, this.offsetY);
    const originWorld = coordinateConverter.fromHexToGame(originHex);
    this.originX = originWorld.x;
    this.originY = originWorld.y;

    this.buildHexMesh();
  }

  private buildHexMesh() {
    const vertices: number[] = [];
    const indices: number[] = [];
    const vertexList: HexVertex[] = [];
    const vertexTypes: number[] = []; // 1.0 for center, 0.0 for corner
    const discardFlags: number[] = []; // 1.0 for discard, 0.0 for keep

    // Map to track which corner vertex indices belong to each hexagon
    const hexCornerMap: Map<string, number[]> = new Map();

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

        const hexKey = `${q}_${r}`;
        const cornerIndices: number[] = [];

        // Check if this hex is in the border
        const isLeftBorder = q === 0;
        const isRightBorder = q === this.gridWidth - 1;
        const isBottomBorder = r === 0;
        const isTopBorder = r === this.gridHeight - 1;
        const isBorderHex =
          isLeftBorder || isRightBorder || isBottomBorder || isTopBorder;

        // Add center vertex
        const centerKey = `c_${q}_${r}`;
        const centerVertex: HexVertex = {
          worldX: centerWorld.x, // Keep world coords for worker
          worldY: centerWorld.y,
          index: vertexList.length,
          hexQ: hex.q,
          hexR: hex.r,
          isCenter: true,
        };
        this.hexVertexMap.set(centerKey, centerVertex);
        vertexList.push(centerVertex);
        vertices.push(center.x, center.y, 0); // Use local coords for geometry
        vertexTypes.push(1.0); // Mark as center vertex
        discardFlags.push(isBorderHex ? 1.0 : 0.0); // Discard if border hex

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
            // First time seeing this corner, create it
            cornerVertex = {
              worldX: cornerWorldX, // Store world coords for worker
              worldY: cornerWorldY,
              index: vertexList.length,
              hexQ: hex.q,
              hexR: hex.r,
              isCenter: false,
            };
            this.hexVertexMap.set(cornerKey, cornerVertex);
            vertexList.push(cornerVertex);
            vertices.push(corners[i].x, corners[i].y, 0); // Use local coords for geometry
            vertexTypes.push(0.0); // Mark as corner vertex
            discardFlags.push(0.0); // Initially keep all corners
          }

          // Track this corner as belonging to this hex
          cornerIndices.push(cornerVertex.index);

          // Create triangle: center -> corner[i] -> corner[(i+1)%6]
          const nextCorner = corners[(i + 1) % 6];
          const nextCornerWorldX = nextCorner.x + this.originX;
          const nextCornerWorldY = nextCorner.y + this.originY;
          const nextCornerKey = `corner_${Math.round(nextCornerWorldX * 1000)}_${Math.round(nextCornerWorldY * 1000)}`;

          let nextCornerVertex = this.hexVertexMap.get(nextCornerKey);

          if (!nextCornerVertex) {
            nextCornerVertex = {
              worldX: nextCornerWorldX, // Store world coords for worker
              worldY: nextCornerWorldY,
              index: vertexList.length,
              hexQ: hex.q,
              hexR: hex.r,
              isCenter: false,
            };
            this.hexVertexMap.set(nextCornerKey, nextCornerVertex);
            vertexList.push(nextCornerVertex);
            vertices.push(nextCorner.x, nextCorner.y, 0); // Use local coords for geometry
            vertexTypes.push(0.0); // Mark as corner vertex
            discardFlags.push(0.0); // Initially keep all corners
          }

          indices.push(
            centerVertex.index,
            cornerVertex.index,
            nextCornerVertex.index,
          );
        }

        // Store the corner indices for this hex
        hexCornerMap.set(hexKey, cornerIndices);
      }
    }

    // Two-pass algorithm for setting discard flags
    // Pass 1: Mark all corners of border hexagons for discard
    for (let q = 0; q < this.gridWidth; q++) {
      for (let r = 0; r < this.gridHeight; r++) {
        const isLeftBorder = q === 0;
        const isRightBorder = q === this.gridWidth - 1;
        const isBottomBorder = r === 0;
        const isTopBorder = r === this.gridHeight - 1;
        const isBorderHex =
          isLeftBorder || isRightBorder || isBottomBorder || isTopBorder;

        if (isBorderHex) {
          const hexKey = `${q}_${r}`;
          const cornerIndices = hexCornerMap.get(hexKey);
          if (cornerIndices) {
            cornerIndices.forEach((idx) => {
              discardFlags[idx] = 1.0;
            });
          }
        }
      }
    }

    // Pass 2: Un-mark corners of non-border hexagons (bring them back)
    for (let q = 0; q < this.gridWidth; q++) {
      for (let r = 0; r < this.gridHeight; r++) {
        const isLeftBorder = q === 0;
        const isRightBorder = q === this.gridWidth - 1;
        const isBottomBorder = r === 0;
        const isTopBorder = r === this.gridHeight - 1;
        const isBorderHex =
          isLeftBorder || isRightBorder || isBottomBorder || isTopBorder;

        if (!isBorderHex) {
          const hexKey = `${q}_${r}`;
          const cornerIndices = hexCornerMap.get(hexKey);
          if (cornerIndices) {
            cornerIndices.forEach((idx) => {
              discardFlags[idx] = 0.0;
            });
          }
        }
      }
    }

    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    this.setAttribute(
      "vertexType",
      new THREE.Float32BufferAttribute(vertexTypes, 1),
    );
    this.setAttribute(
      "borderFlag",
      new THREE.Float32BufferAttribute(discardFlags, 1),
    );
    this.setIndex(indices);
    this.computeVertexNormals();
  }

  private getHexCorners(
    centerX: number,
    centerY: number,
  ): { x: number; y: number }[] {
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
    this.hexVertexMap.forEach((v) => vertices.push(v));
    return vertices.sort((a, b) => a.index - b.index);
  }
}
