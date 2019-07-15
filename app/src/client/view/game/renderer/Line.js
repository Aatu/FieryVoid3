import * as THREE from "three";

import { loadObject, cloneObject } from "../utils/objectLoader";
import { lineFragmentShader, lineVertexShader } from "./shader";
import { degreeToRadian } from "../../../../model/utils/math.mjs";

let hexagonMesh = null;

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: lineVertexShader,
  fragmentShader: lineFragmentShader,
  transparent: true,
  depthWrite: false,
  //depthTest: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending
});

const uniforms = {
  time: { type: "f", value: 0.0 }
};

baseMaterial.uniforms = uniforms;
/*
const baseMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0, 1, 0)
});
*/

const animate = () => {
  const now = Date.now();
  baseMaterial.uniforms.time.value = (now % 1000) * 0.001;
  baseMaterial.needsUpdate = true;
  requestAnimationFrame(animate);
};

const verticeAmount = 16;

animate();

class Line {
  constructor(scene, args = {}) {
    if (!args) {
      args = {};
    }

    this.scene = scene;
    this.mesh = null;
    this.start = args.start;
    this.end = args.end;
    this.width = args.width || 10;
    this.pulseAmount = args.pulseAmount || 0;
    this.pulseSpeed = args.pulseSpeed || 1;
    this.dashSize = args.dashSize || 0;
    this.length = new THREE.Vector3().subVectors(this.start, this.end).length();

    this.color = args.color;
    this.opacity = args.opacity;

    this.currentRotationMatrix = null;

    this.create(this.start, this.end, this.width);
  }

  async getGeometry() {
    if (!hexagonMesh) {
      const scene = await loadObject("/img/3d/line2/scene.gltf");
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
    mesh.scale.set(width, width, height);

    return mesh;
  }

  setPulse(amount, speed = 1) {
    this.pulseAmount = amount;
    this.pulseSpeed = speed;

    console.log(this.pulseAmount, this.pulseSpeed);
    if (!this.pulseAttribute) {
      const pulses = [];
      for (let i = 0; i < verticeAmount; i++) {
        pulses.push(this.pulseAmount, this.pulseSpeed);
      }
      this.pulseAttribute = new THREE.BufferAttribute(
        new Float32Array(pulses),
        2
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("pulse", this.pulseAttribute);
    } else {
      for (let i = 0; i < verticeAmount; i++) {
        this.pulseAttribute.setXY(i, this.pulseAmount, this.pulseSpeed);
      }
    }

    this.dashAttribute.needsUpdate = true;
  }

  setDashed(dashSize) {
    this.dashRatio = dashSize / this.length;

    if (!this.dashAttribute) {
      const dashes = [];
      for (let i = 0; i < verticeAmount; i++) {
        dashes.push(this.dashRatio);
      }
      this.dashAttribute = new THREE.BufferAttribute(
        new Float32Array(dashes),
        1
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("dashRatio", this.dashAttribute);
    } else {
      for (let i = 0; i < verticeAmount; i++) {
        this.dashAttribute.setX(i, this.dashAttribute);
      }
    }

    this.dashAttribute.needsUpdate = true;
  }

  setColor(color) {
    this.color = color;
    if (!this.colorAttribute) {
      const colors = [];
      for (let i = 0; i < verticeAmount; i++) {
        colors.push(this.color.r, this.color.g, this.color.b);
      }
      this.colorAttribute = new THREE.BufferAttribute(
        new Float32Array(colors),
        3
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("color", this.colorAttribute);
    } else {
      for (let i = 0; i < verticeAmount; i++) {
        this.colorAttribute.setXYZ(i, this.color.r, this.color.g, this.color.b);
      }
    }

    this.colorAttribute.needsUpdate = true;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    if (!this.opacityAttribute) {
      const opacitys = [];
      for (let i = 0; i < verticeAmount; i++) {
        opacitys.push(opacity);
      }
      this.opacityAttribute = new THREE.BufferAttribute(
        new Float32Array(opacitys),
        1
      ).setDynamic(true);
      this.mesh.geometry.addAttribute("opacity", this.opacityAttribute);
    } else {
      for (let i = 0; i < verticeAmount; i++) {
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
    const mesh = await this.createMesh(lineWidth, this.length);
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
    this.setDashed(this.dashSize);
    this.setPulse(this.pulseAmount, this.pulseSpeed);
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
    lineWidth = lineWidth || this.width;
    this.width = lineWidth;
    this.start = start;
    this.end = end;
    //this.updateMesh(start, end, lineWidth, this.mesh);
    //this.mesh.rotation.setFromVector3({x: 0, y: 0, z: 0});
  }

  setLineWidth(lineWidth) {
    this.width = lineWidth;
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
