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
  public readonly originX: number;
  public readonly originY: number;

  constructor(size: number, originX: number, originY: number) {
    super();

    this.originX = originX;
    this.originY = originY;

    // Add 1 border on each side (left + right = 2, bottom + top = 2)
    this.gridWidth = size + 2;
    this.gridHeight = size + 2;

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

    // Calculate the local offset (start 1 hex before 0 to create borders)
    const localOffsetQ = -1;
    const localOffsetR = -1;

    // Create vertices for each hex
    for (let q = 0; q < this.gridWidth; q++) {
      for (let r = 0; r < this.gridHeight; r++) {
        // Local hex indices (relative to this geometry)
        const localQ = q + localOffsetQ;
        const localR = r + localOffsetR;
        const localHex = new Offset(localQ, localR);

        // Calculate local game coordinates
        const centerLocal = coordinateConverter.fromHexToGame(localHex);

        // Calculate world coordinates for the worker
        const centerWorldX = centerLocal.x + this.originX;
        const centerWorldY = centerLocal.y + this.originY;

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
          worldX: centerWorldX, // World coords for worker
          worldY: centerWorldY,
          index: vertexList.length,
          hexQ: localQ,
          hexR: localR,
          isCenter: true,
        };
        this.hexVertexMap.set(centerKey, centerVertex);
        vertexList.push(centerVertex);
        vertices.push(centerLocal.x, centerLocal.y, 0); // Use local coords for geometry
        vertexTypes.push(1.0); // Mark as center vertex
        discardFlags.push(isBorderHex ? 1.0 : 0.0); // Discard if border hex

        // Add corner vertices
        const corners = this.getHexCorners(centerLocal.x, centerLocal.y);
        for (let i = 0; i < 6; i++) {
          // Use local coordinates for the key so adjacent hexes share vertices
          const cornerKey = `corner_${Math.round(corners[i].x * 1000)}_${Math.round(corners[i].y * 1000)}`;

          // Check if this corner already exists (shared with adjacent hex)
          let cornerVertex = this.hexVertexMap.get(cornerKey);

          if (!cornerVertex) {
            // First time seeing this corner, create it
            const cornerWorldX = corners[i].x + this.originX;
            const cornerWorldY = corners[i].y + this.originY;

            cornerVertex = {
              worldX: cornerWorldX, // World coords for worker
              worldY: cornerWorldY,
              index: vertexList.length,
              hexQ: localQ,
              hexR: localR,
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
          const nextCornerKey = `corner_${Math.round(nextCorner.x * 1000)}_${Math.round(nextCorner.y * 1000)}`;

          let nextCornerVertex = this.hexVertexMap.get(nextCornerKey);

          if (!nextCornerVertex) {
            const nextCornerWorldX = nextCorner.x + this.originX;
            const nextCornerWorldY = nextCorner.y + this.originY;

            nextCornerVertex = {
              worldX: nextCornerWorldX, // World coords for worker
              worldY: nextCornerWorldY,
              index: vertexList.length,
              hexQ: localQ,
              hexR: localR,
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
