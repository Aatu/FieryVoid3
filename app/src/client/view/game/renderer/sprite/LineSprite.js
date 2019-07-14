import * as THREE from "three";

import { loadObject } from "../../utils/objectLoader";

const hexagonMesh = null;

class LineSprite {
  constructor(start, end, lineWidth, color, opacity, args) {
    if (!args) {
      args = {};
    }

    this.mesh = null;
    this.start = start;
    this.end = end;
    this.lineWidth = lineWidth || 10;

    this.color = color;
    this.opacity = opacity;

    this.material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      map: args.texture || null,
      blending: args.blending || THREE.NormalBlending,
      depthWrite: false
      //side: THREE.DoubleSide
    });

    this.currentRotationMatrix = null;
    this.mesh = this.create(
      this.start,
      this.end,
      this.lineWidth,
      this.material
    );
  }

  async getGeometry() {
    if (!hexagonMesh) {
      hexagonMesh = await loadObject("/img/3d/line/scene.gltf");
    }

    return hexagonMesh;
  }

  create(pointX, pointY, lineWidth, material) {
    const direction = new THREE.Vector3().subVectors(pointY, pointX);
    const orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(
      new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
    );
    const edgeGeometry = new THREE.CylinderGeometry(
      lineWidth / 2,
      lineWidth / 2,
      direction.length(),
      8,
      1
    );

    const edge = new THREE.Mesh(edgeGeometry, material);
    edge.applyMatrix(orientation);
    this.currentRotationMatrix = orientation;
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
    return edge;
  }

  updateMesh(pointX, pointY, lineWidth, edge) {
    const direction = new THREE.Vector3().subVectors(pointY, pointX);
    const orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(
      new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
    );

    edge.applyMatrix(
      new THREE.Matrix4().getInverse(this.currentRotationMatrix)
    );
    edge.geometry = new THREE.CylinderGeometry(
      lineWidth / 2,
      lineWidth / 2,
      direction.length(),
      8,
      1
    );

    edge.applyMatrix(orientation);
    this.currentRotationMatrix = orientation;
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
  }

  setOverlayColor(color) {
    this.material.color = color;
    this.material.needsUpdate = true;
  }

  update(start, end, lineWidth) {
    lineWidth = lineWidth || this.lineWidth;
    this.lineWidth = lineWidth;
    this.start = start;
    this.end = end;
    this.updateMesh(start, end, lineWidth, this.mesh);
    //this.mesh.rotation.setFromVector3({x: 0, y: 0, z: 0});
  }

  setLineWidth(lineWidth) {
    this.lineWidth = lineWidth;
    this.updateMesh(this.start, this.end, this.lineWidth, this.mesh);
    //this.mesh.rotation.setFromVector3({x: 0, y: 0, z: 0});
  }

  multiplyOpacity(m) {
    this.material.opacity = this.opacity * m;
  }

  hide() {
    this.mesh.visible = false;
    return this;
  }

  show() {
    this.mesh.visible = true;
    return this;
  }

  destroy() {
    this.mesh.material.dispose();
  }
}

export default LineSprite;
