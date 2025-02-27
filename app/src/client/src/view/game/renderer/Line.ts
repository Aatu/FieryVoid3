import * as THREE from "three";

import { loadObject } from "../utils/objectLoader";
import { lineFragmentShader, lineVertexShader } from "./shader";
import {
  getPromise,
  ReadyPromise,
} from "@fieryvoid3/model/src/utils/ReadyPromise";
import { degreeToRadian } from "@fieryvoid3/model/src/utils/math";
import Vector from "@fieryvoid3/model/src/utils/Vector";

let hexagonMesh: THREE.Mesh | null = null;

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: lineVertexShader,
  fragmentShader: lineFragmentShader,
  transparent: true,
  depthWrite: false,
  //depthTest: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});

const uniforms = {
  time: { type: "f", value: 0.0 },
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

animate();

type LineArgs = {
  start?: Vector;
  end?: Vector;
  width?: number;
  pulseAmount?: number;
  pulseSpeed?: number;
  dashSize?: number;
  type?: "cylinder" | "laser";
  color?: THREE.Color;
  opacity?: number;
};

class Line {
  private scene: THREE.Object3D;
  private mesh: THREE.Mesh | null;
  private start: Vector;
  private end: Vector;
  private width: number;
  private pulseAmount: number;
  private pulseSpeed: number;
  private dashSize: number;
  private length: number;
  private type: "cylinder" | "laser";
  private ready: ReadyPromise<boolean>;
  private color: THREE.Color;
  private opacity: number;
  private currentRotationMatrix: THREE.Matrix4 | null;
  private pulseAttribute: THREE.BufferAttribute | null = null;
  private dashAttribute: THREE.BufferAttribute | null = null;
  private colorAttribute: THREE.BufferAttribute | null = null;
  private opacityAttribute: THREE.BufferAttribute | null = null;

  constructor(scene: THREE.Object3D, args: LineArgs = {}) {
    if (!args) {
      args = {};
    }

    this.scene = scene;
    this.mesh = null;
    this.start = args.start || new Vector(0, 0, 0);
    this.end = args.end || new Vector(0, 0, 0);
    this.width = args.width || 10;
    this.pulseAmount = args.pulseAmount || 0;
    this.pulseSpeed = args.pulseSpeed || 1;
    this.dashSize = args.dashSize || 0;
    this.length = new THREE.Vector3().subVectors(this.start, this.end).length();
    this.type = args.type || "laser";

    this.ready = getPromise();

    this.color = args.color || new THREE.Color(1, 1, 1);
    this.opacity = args.opacity || 1;

    this.currentRotationMatrix = null;

    this.create(this.start, this.end, this.width);
  }

  async getGeometry() {
    if (!hexagonMesh) {
      const object = await loadObject("/img/3d/line2/scene.gltf");
      hexagonMesh = object.object.children[0] as THREE.Mesh;
      hexagonMesh.rotation.set(
        hexagonMesh.rotation.x + degreeToRadian(90),
        hexagonMesh.rotation.y,
        hexagonMesh.rotation.z
      );
      hexagonMesh.material = baseMaterial;
    }

    return hexagonMesh;
  }

  async createMesh(width: number, height: number) {
    let mesh = await this.getGeometry();
    mesh = mesh.clone();
    mesh.geometry = mesh.geometry.clone();
    //mesh.material = baseMaterial.clone();
    mesh.scale.set(width, width, height);

    return mesh;
  }

  getMesh(): THREE.Mesh {
    if (!this.mesh) {
      throw new Error("Mesh not created yet");
    }

    return this.mesh;
  }

  getVertexAmount() {
    switch (this.type) {
      case "cylinder":
        return 14;
      case "laser":
        return 16;
    }
  }

  setPulse(amount: number, speed: number = 1) {
    this.pulseAmount = amount;
    this.pulseSpeed = speed;

    if (!this.pulseAttribute) {
      const pulses = [];
      for (let i = 0; i < this.getVertexAmount(); i++) {
        pulses.push(this.pulseAmount, this.pulseSpeed);
      }
      this.pulseAttribute = new THREE.BufferAttribute(
        new Float32Array(pulses),
        2
      );
      this.getMesh().geometry.setAttribute("pulse", this.pulseAttribute);
    } else {
      for (let i = 0; i < this.getVertexAmount(); i++) {
        this.pulseAttribute.setXY(i, this.pulseAmount, this.pulseSpeed);
      }
    }

    this.pulseAttribute.needsUpdate = true;
  }

  setDashed(dashSize: number) {
    const dashRatio = dashSize / this.length;

    if (!this.dashAttribute) {
      const dashes = [];
      for (let i = 0; i < this.getVertexAmount(); i++) {
        dashes.push(dashRatio);
      }
      this.dashAttribute = new THREE.BufferAttribute(
        new Float32Array(dashes),
        1
      );
      this.getMesh().geometry.setAttribute("dashRatio", this.dashAttribute);
    } else {
      for (let i = 0; i < this.getVertexAmount(); i++) {
        this.dashAttribute.setX(i, dashRatio);
      }
    }

    this.dashAttribute.needsUpdate = true;
  }

  setColorAttribute(color: THREE.Color) {
    const colors = [];
    for (let i = 0; i < this.getVertexAmount(); i++) {
      colors.push(color.r, color.g, color.b);
    }
    this.colorAttribute = new THREE.BufferAttribute(
      new Float32Array(colors),
      3
    );
    this.getMesh().geometry.setAttribute("color", this.colorAttribute);

    this.colorAttribute.needsUpdate = true;
  }

  async setColor(color: THREE.Color) {
    this.color = color;

    await this.ready.promise;

    if (!this.colorAttribute) {
      const colors = [];
      for (let i = 0; i < this.getVertexAmount(); i++) {
        colors.push(color.r, color.g, color.b);
      }
      this.colorAttribute = new THREE.BufferAttribute(
        new Float32Array(colors),
        3
      );
      this.getMesh().geometry.setAttribute("color", this.colorAttribute);
    } else {
      for (let i = 0; i < this.getVertexAmount(); i++) {
        this.colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }
    }

    this.colorAttribute.needsUpdate = true;
  }

  setOpacity(opacity: number) {
    this.opacity = opacity;
    if (!this.opacityAttribute) {
      const opacitys = [];
      for (let i = 0; i < this.getVertexAmount(); i++) {
        opacitys.push(opacity);
      }
      this.opacityAttribute = new THREE.BufferAttribute(
        new Float32Array(opacitys),
        1
      );
      this.getMesh().geometry.setAttribute("opacity", this.opacityAttribute);
    } else {
      for (let i = 0; i < this.getVertexAmount(); i++) {
        this.opacityAttribute.setX(i, this.opacity);
      }
    }

    this.opacityAttribute.needsUpdate = true;
  }

  getOrientation(pointX: Vector, pointY: Vector) {
    const orientation = new THREE.Matrix4();
    orientation.lookAt(
      pointX.toThree(),
      pointY.toThree(),
      new THREE.Object3D().up
    );
    orientation.multiply(
      new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
    );

    return orientation;
  }

  async create(pointX: Vector, pointY: Vector, lineWidth: number) {
    const mesh = await this.createMesh(lineWidth, this.length);
    const orientation = this.getOrientation(pointX, pointY);

    mesh.applyMatrix4(orientation);
    this.currentRotationMatrix = orientation;

    mesh.position.x = (pointY.x + pointX.x) / 2;
    mesh.position.y = (pointY.y + pointX.y) / 2;
    mesh.position.z = (pointY.z + pointX.z) / 2;

    this.scene.add(mesh);
    this.mesh = mesh;
    this.ready.resolve(true);
    this.setColor(this.color);
    this.setOpacity(this.opacity);
    this.setDashed(this.dashSize);
    this.setPulse(this.pulseAmount, this.pulseSpeed);
  }

  updateMesh() {
    const orientation = this.getOrientation(this.start, this.end);

    if (!this.currentRotationMatrix) {
      throw new Error("No current rotation matrix");
    }

    this.getMesh().applyMatrix4(
      this.currentRotationMatrix.invert()
      //new THREE.Matrix4().getInverse(this.currentRotationMatrix)
    );

    this.getMesh().scale.set(this.width, this.width, this.length);

    this.getMesh().applyMatrix4(orientation);
    this.currentRotationMatrix = orientation;
    this.getMesh().position.x = (this.end.x + this.start.x) / 2;
    this.getMesh().position.y = (this.end.y + this.start.y) / 2;
    this.getMesh().position.z = (this.end.z + this.start.z) / 2;
  }

  async update(start: Vector, end: Vector, lineWidth: number) {
    await this.ready.promise;
    this.width = lineWidth;
    this.start = start;
    this.end = end;
    this.length = new THREE.Vector3().subVectors(this.start, this.end).length();
    this.updateMesh();
  }

  setEnd(end: Vector) {
    this.update(this.start, end, this.width);
  }

  setLineWidth(lineWidth: number) {
    this.width = lineWidth;

    this.getMesh().scale.set(this.width, this.width, this.length);
  }

  multiplyOpacity(m: number) {
    this.setOpacity(this.opacity * m);
  }

  async hide() {
    await this.ready.promise;
    this.getMesh().visible = false;
    return this;
  }

  async show() {
    await this.ready.promise;
    this.getMesh().visible = true;
    return this;
  }

  async destroy() {
    await this.ready.promise;
    this.scene.remove(this.getMesh());
  }
}

export default Line;
