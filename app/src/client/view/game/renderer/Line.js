import * as THREE from "three";

import { loadObject, cloneObject } from "../utils/objectLoader";
import { lineFragmentShader, lineVertexShader } from "./shader";
import { degreeToRadian } from "../../../../model/utils/math.mjs";

let hexagonMesh = null;

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: lineVertexShader,
  fragmentShader: lineFragmentShader,
  transparent: true,
  depthWrite: false
});

/*
const uniforms = {
  color: { type: "v3", value: new THREE.Color(0, 1, 0) }
};


baseMaterial.uniforms = uniforms;
/*
const baseMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0, 1, 0)
});
*/

const meshes = [];

class Line {
  constructor(scene, start, end, lineWidth, color, opacity, args) {
    if (!args) {
      args = {};
    }

    this.scene = scene;
    this.mesh = null;
    this.start = start;
    this.end = end;
    this.lineWidth = lineWidth || 10;

    this.color = color;
    this.opacity = opacity;

    this.currentRotationMatrix = null;

    this.create(this.start, this.end, this.lineWidth);
  }

  async getGeometry() {
    if (!hexagonMesh) {
      const scene = await loadObject("/img/3d/line/scene.gltf");
      hexagonMesh = scene.children[0];
      hexagonMesh.rotation.set(
        hexagonMesh.rotation.x + degreeToRadian(90),
        hexagonMesh.rotation.y,
        hexagonMesh.rotation.z
      );
      hexagonMesh.material = baseMaterial;
    }

    return hexagonMesh;
  }

  async createMesh(width, height) {
    let mesh = await this.getGeometry();
    mesh = mesh.clone();
    mesh.geometry = mesh.geometry.clone();
    //mesh.material = baseMaterial.clone();
    mesh.scale.set(width / 2, width / 2, height / 2);

    return mesh;
  }

  setColor(color) {
    this.color = color;
    if (!this.colorAttribute) {
      const colors = [];
      for (let i = 0; i < 14; i++) {
        colors.push(this.color.r, this.color.g, this.color.b);
      }
      this.colorAttribute = new THREE.BufferAttribute(
        new Float32Array(colors),
        3
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("color", this.colorAttribute);
    } else {
      for (let i = 0; i < 14; i++) {
        this.colorAttribute.setXYZ(i, this.color.r, this.color.g, this.color.b);
      }
    }

    this.colorAttribute.needsUpdate = true;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    if (!this.opacityAttribute) {
      const opacitys = [];
      for (let i = 0; i < 14; i++) {
        opacitys.push(opacity);
      }
      this.opacityAttribute = new THREE.BufferAttribute(
        new Float32Array(opacitys),
        1
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("opacity", this.opacityAttribute);
    } else {
      for (let i = 0; i < 14; i++) {
        this.opacityAttribute.setX(i, this.opacity);
      }
    }

    this.opacityAttribute.needsUpdate = true;
  }

  getOrientation(pointX, pointY) {
    const orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(
      new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
    );

    return orientation;
  }

  async create(pointX, pointY, lineWidth) {
    const direction = new THREE.Vector3().subVectors(pointY, pointX);
    const mesh = await this.createMesh(lineWidth, direction.length());
    const orientation = this.getOrientation(pointX, pointY);

    mesh.applyMatrix(orientation);
    this.currentRotationMatrix = orientation;

    mesh.position.x = (pointY.x + pointX.x) / 2;
    mesh.position.y = (pointY.y + pointX.y) / 2;
    mesh.position.z = (pointY.z + pointX.z) / 2;

    this.scene.add(mesh);
    this.mesh = mesh;
    this.setColor(this.color);
    this.setOpacity(this.opacity);
  }

  updateMesh(pointX, pointY, lineWidth, mesh) {
    const direction = new THREE.Vector3().subVectors(pointY, pointX);
    const orientation = this.getOrientation(pointX, pointY);

    mesh.applyMatrix(
      new THREE.Matrix4().getInverse(this.currentRotationMatrix)
    );

    mesh.scale.set(lineWidth / 2, lineWidth / 2, direction.length() / 2);

    mesh.applyMatrix(orientation);
    this.currentRotationMatrix = orientation;
    mesh.position.x = (pointY.x + pointX.x) / 2;
    mesh.position.y = (pointY.y + pointX.y) / 2;
    mesh.position.z = (pointY.z + pointX.z) / 2;
  }

  update(start, end, lineWidth) {
    lineWidth = lineWidth || this.lineWidth;
    this.lineWidth = lineWidth;
    this.start = start;
    this.end = end;
    //this.updateMesh(start, end, lineWidth, this.mesh);
    //this.mesh.rotation.setFromVector3({x: 0, y: 0, z: 0});
  }

  setLineWidth(lineWidth) {
    this.lineWidth = lineWidth;
    //this.updateMesh(this.start, this.end, this.lineWidth, this.mesh);
    //this.mesh.rotation.setFromVector3({x: 0, y: 0, z: 0});
  }

  multiplyOpacity(m) {
    this.setOpacity(this.opacity * m);
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
    this.scene.remove(this.mesh);
  }
}

export default Line;
