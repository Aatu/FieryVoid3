import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";
import BoltInstance from "./BoltInstance";

class BoltContainer {
  private offsetAttribute: THREE.InstancedBufferAttribute;
  private opacityAttribute: THREE.InstancedBufferAttribute;
  private textureNumberAttribute: THREE.InstancedBufferAttribute;
  private scaleAttribute: THREE.InstancedBufferAttribute;
  private quaternionAttribute: THREE.InstancedBufferAttribute;
  private colorAttribute: THREE.InstancedBufferAttribute;
  private velocityAttribute: THREE.InstancedBufferAttribute;
  private activationGameTimeAttribute: THREE.InstancedBufferAttribute;
  private deactivationGameTimeAttribute: THREE.InstancedBufferAttribute;
  private deactivationFadeAttribute: THREE.InstancedBufferAttribute;
  private repeatAttribute: THREE.InstancedBufferAttribute;
  private amount: number;
  private mesh: THREE.Mesh;
  private scene: THREE.Scene;
  public numberCreated: number;
  private free: number[];
  public used: number = 0;
  private flyBolt: BoltInstance;

  constructor(
    offsetAttribute: THREE.InstancedBufferAttribute,
    opacityAttribute: THREE.InstancedBufferAttribute,
    textureNumberAttribute: THREE.InstancedBufferAttribute,
    scaleAttribute: THREE.InstancedBufferAttribute,
    quaternionAttribute: THREE.InstancedBufferAttribute,
    colorAttribute: THREE.InstancedBufferAttribute,
    velocityAttribute: THREE.InstancedBufferAttribute,
    activationGameTimeAttribute: THREE.InstancedBufferAttribute,
    deactivationGameTimeAttribute: THREE.InstancedBufferAttribute,
    deactivationFadeAttribute: THREE.InstancedBufferAttribute,
    repeatAttribute: THREE.InstancedBufferAttribute,
    amount: number,
    mesh: THREE.Mesh,
    scene: THREE.Scene,
    numberCreated: number
  ) {
    this.amount = amount;
    this.offsetAttribute = offsetAttribute;
    this.opacityAttribute = opacityAttribute;
    this.textureNumberAttribute = textureNumberAttribute;
    this.scaleAttribute = scaleAttribute;
    this.quaternionAttribute = quaternionAttribute;
    this.colorAttribute = colorAttribute;
    this.velocityAttribute = velocityAttribute;
    this.activationGameTimeAttribute = activationGameTimeAttribute;
    this.deactivationGameTimeAttribute = deactivationGameTimeAttribute;
    this.deactivationFadeAttribute = deactivationFadeAttribute;
    this.repeatAttribute = repeatAttribute;
    this.mesh = mesh;
    this.scene = scene;
    this.numberCreated = numberCreated;

    this.free = [];
    for (let i = 0; i < this.amount; i++) {
      this.free.push(i);
    }

    this.flyBolt = new BoltInstance(this);
  }

  setRenderOrder(/* order */) {
    //console.log(this.mesh.renderOrder);
    //console.log("setting renderOrder ", order);
    //this.mesh.renderOrder = order;
  }

  hasFree() {
    return this.free.length > 0;
  }

  discard() {
    this.scene.remove(this.mesh);
  }

  resetIndex() {
    this.used = 0;
  }

  unassignEverything() {
    for (let i = 0; i < this.amount; i++) {
      this.opacityAttribute.setX(i, 0);
    }

    this.opacityAttribute.needsUpdate = true;

    this.used = 0;
  }

  freeParticles(particleIndices: number | number[]) {
    particleIndices = ([] as number[]).concat(particleIndices);

    particleIndices = particleIndices.filter(
      (index) => !this.free.includes(index)
    );

    particleIndices.forEach((i) => {
      this.opacityAttribute.setX(i, 0);
    });

    this.opacityAttribute.needsUpdate = true;

    this.free = this.free.concat(particleIndices);
  }

  getParticle() {
    if (this.free.length === 0) {
      throw new Error("Container is full");
    }

    return this.flyBolt.setIndex(this.free.pop()!).setEmitter(this);
  }

  setOpacity(index: number, opacity: number) {
    this.opacityAttribute.setX(index, opacity);
    this.opacityAttribute.needsUpdate = true;
  }

  setPosition(index: number, position: IVector) {
    this.offsetAttribute.setXYZ(index, position.x, position.y, position.z);
    this.offsetAttribute.needsUpdate = true;
  }

  setParentPosition({ x, y, z }: IVector) {
    this.mesh.position.set(x, y, z);
  }

  setScale(index: number, scale: IVector) {
    this.scaleAttribute.setXYZ(index, scale.x, scale.y, scale.z);
    this.scaleAttribute.needsUpdate = true;
  }

  setQuaternion(
    index: number,
    quaternion: { x: number; y: number; z: number; w: number }
  ) {
    this.quaternionAttribute.setXYZW(
      index,
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w
    );

    this.quaternionAttribute.needsUpdate = true;
  }

  setTexture(index: number, texture: number) {
    this.textureNumberAttribute.setX(index, texture);
    this.textureNumberAttribute.needsUpdate = true;
  }

  setColor(index: number, color: { r: number; g: number; b: number }) {
    this.colorAttribute.setXYZ(index, color.r, color.g, color.b);
    this.colorAttribute.needsUpdate = true;
  }

  setVelocity(index: number, velocity: IVector) {
    this.velocityAttribute.setXYZ(index, velocity.x, velocity.y, velocity.z);
    this.velocityAttribute.needsUpdate = true;
  }

  setActivationTime(index: number, time: number) {
    this.activationGameTimeAttribute.setX(index, time);
    this.activationGameTimeAttribute.needsUpdate = true;
  }

  setDeactivationTime(index: number, time: number, fade: number = 0) {
    this.deactivationGameTimeAttribute.setX(index, time);
    this.deactivationFadeAttribute.setX(index, fade);
    this.deactivationGameTimeAttribute.needsUpdate = true;
    this.deactivationFadeAttribute.needsUpdate = true;
  }

  setRepeat(index: number, repeat: number) {
    this.repeatAttribute.setX(index, repeat);
    this.repeatAttribute.needsUpdate = true;
  }
}

export default BoltContainer;
