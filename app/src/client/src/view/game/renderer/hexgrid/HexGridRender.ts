import * as THREE from "three";
import HexagonTexture from "./HexagonTexture";
import HexagonMath from "@fieryvoid3/model/src/utils/HexagonMath";

const HEX_COUNT_WIDTH = 9999;
const HEX_COUNT_HEIGHT = 9999;
const HEX_LINE_COLOR = "rgba(255,255,255,255)";
const HEX_FILL_COLOR = "rgba(0,0,0,0)";
const HEX_LINE_WIDTH = 20;
const HEX_CANVAS_SIZE = 1024;
const HEX_OPACITY = 0.05;
//const HEX_MAX_OPACITY = 0.3;

const getGeometryWidth = () => HexagonMath.getGridWidth(HEX_COUNT_WIDTH);

const getGeometryHeight = () => HexagonMath.getGridHeight(HEX_COUNT_HEIGHT);

class HexGridRenderer {
  private material: THREE.MeshBasicMaterial | null;
  private mesh: THREE.Mesh | null;

  constructor() {
    this.material = null;
    this.mesh = null;
  }

  renderHexGrid(scene: THREE.Object3D) {
    const width = getGeometryWidth();
    const height = getGeometryHeight();

    const texture = HexagonTexture.getHexGridTexture(
      HEX_CANVAS_SIZE,
      HEX_COUNT_WIDTH,
      HEX_COUNT_HEIGHT,
      HEX_LINE_COLOR,
      HEX_FILL_COLOR,
      HEX_LINE_WIDTH
    );

    const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: HEX_OPACITY,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.x += HexagonMath.getHexB() / 2;
    this.mesh.name = "hexgrid";

    scene.add(this.mesh);
  }

  onZoom = function (zoom: number) {
    if (zoom > 1) {
      //this.material.opacity = (HEX_MAX_OPACITY - HEX_OPACITY) * ((zoom - 1) / (this.maxZoom - 1)) + HEX_OPACITY;
    } else {
      //this.material.opacity = zoom * HEX_OPACITY;
    }
  };
}

export default HexGridRenderer;
