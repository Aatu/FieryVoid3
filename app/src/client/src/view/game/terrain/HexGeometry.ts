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
    const vertexTypes: number[] = []; // 1.0 for center, 0.0 for corner
    const discardFlags: number[] = []; // 1.0 for discard, 0.0 for keep

    // Helper function to determine if a corner should be discarded
    const shouldDiscardCorner = (localQ: number, localR: number, cornerIndex: number): boolean => {
      const isLeftBorder = localQ === 0;
      const isBottomBorder = localR === 0;

      if (!isLeftBorder && !isBottomBorder) {
        return false; // Not a border hex, keep all corners
      }

      if (isLeftBorder && isBottomBorder) {
        // Bottom-left corner hex: keep only corners 0, 1 (top-right corners)
        return cornerIndex !== 0 && cornerIndex !== 1;
      } else if (isLeftBorder) {
        // Left border: keep right-side corners 0, 1, 5
        return cornerIndex === 2 || cornerIndex === 3 || cornerIndex === 4;
      } else if (isBottomBorder) {
        // Bottom border: keep top-side corners 0, 1, 2
        return cornerIndex === 3 || cornerIndex === 4 || cornerIndex === 5;
      }

      return false;
    };

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

        // Check if this hex is in the border (first row or first column)
        const isLeftBorder = q === 0;
        const isBottomBorder = r === 0;
        const isBorderHex = isLeftBorder || isBottomBorder;

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
        vertexTypes.push(1.0);  // Mark as center vertex
        discardFlags.push(isBorderHex ? 1.0 : 0.0);  // Discard if border hex

        // Add corner vertices
        const corners = this.getHexCorners(center.x, center.y);
        for (let i = 0; i < 6; i++) {
          const cornerWorldX = corners[i].x + this.originX;
          const cornerWorldY = corners[i].y + this.originY;
          // Use world coordinates for the key so adjacent hexes share vertices
          const cornerKey = `corner_${Math.round(cornerWorldX * 1000)}_${Math.round(cornerWorldY * 1000)}`;

          // Determine if THIS hex wants to discard this corner
          const thisHexDiscardsCorner = shouldDiscardCorner(q, r, i);

          // Check if this corner already exists (shared with adjacent hex)
          let cornerVertex = this.hexVertexMap.get(cornerKey);

          if (!cornerVertex) {
            // First time seeing this corner, create it
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
            vertexTypes.push(0.0);  // Mark as corner vertex
            discardFlags.push(thisHexDiscardsCorner ? 1.0 : 0.0);
          } else {
            // Corner already exists (shared with another hex)
            // If THIS hex wants to keep it, update the flag to keep it
            if (!thisHexDiscardsCorner) {
              discardFlags[cornerVertex.index] = 0.0;
            }
          }

          // Create triangle: center -> corner[i] -> corner[(i+1)%6]
          const nextCorner = corners[(i + 1) % 6];
          const nextCornerWorldX = nextCorner.x + this.originX;
          const nextCornerWorldY = nextCorner.y + this.originY;
          const nextCornerKey = `corner_${Math.round(nextCornerWorldX * 1000)}_${Math.round(nextCornerWorldY * 1000)}`;

          const thisHexDiscardsNextCorner = shouldDiscardCorner(q, r, (i + 1) % 6);
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
            vertexTypes.push(0.0);  // Mark as corner vertex
            discardFlags.push(thisHexDiscardsNextCorner ? 1.0 : 0.0);
          } else {
            // Update flag if this hex wants to keep it
            if (!thisHexDiscardsNextCorner) {
              discardFlags[nextCornerVertex.index] = 0.0;
            }
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
    this.setAttribute('vertexType', new THREE.Float32BufferAttribute(vertexTypes, 1));
    this.setAttribute('borderFlag', new THREE.Float32BufferAttribute(discardFlags, 1));
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
