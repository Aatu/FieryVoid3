import { loadObject } from "../../utils/objectLoader";

import * as THREE from "three";
import { ParticleEmitter } from "../../animation/particle";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import {
  addToDirection,
  degreeToRadian,
  getSeededRandomGenerator,
} from "@fieryvoid3/model/src/utils/math";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { PARTICLE_TEXTURE } from "../../animation/particle/BaseParticle";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

const torpedoMesh = loadObject("/img/3d/torpedo/scene.gltf");

class TorpedoObject {
  public torpedoFlight: TorpedoFlight;
  private scene: THREE.Object3D;
  private object: THREE.Object3D;
  private particleEmitter: ParticleEmitter;
  private lastAnimationTime: number | null;
  private totalAnimationTime: number;
  private hidden: boolean;
  private torpedo: THREE.Object3D | null;
  private facing: number = 0;

  constructor(torpedoFlight: TorpedoFlight, scene: THREE.Object3D) {
    this.torpedoFlight = torpedoFlight;
    this.scene = scene;
    this.torpedo = null;

    this.object = new THREE.Object3D();
    this.particleEmitter = new ParticleEmitter(this.object, 10);
    this.create();
    this.lastAnimationTime = null;
    this.totalAnimationTime = 0;

    this.hidden = true;
  }

  hide() {
    if (this.hidden) {
      return;
    }

    this.scene.remove(this.object);
    this.hidden = true;
  }

  show() {
    if (!this.hidden) {
      return;
    }

    this.scene.add(this.object);
    this.hidden = false;
  }

  setFacing(facing: number) {
    if (this.facing === facing) {
      return;
    }
    this.facing = facing;
    this.object.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      degreeToRadian(facing)
    );
    this.createParticleEffect();
  }

  setPosition(position: IVector) {
    this.object.position.set(position.x, position.y, position.z);
    return this;
  }

  getTorpedo() {
    if (!this.torpedo) {
      throw new Error("Torpedo not loaded");
    }

    return this.torpedo;
  }

  getEnginePosition() {
    const slot = this.getTorpedo().children.find((child) => {
      if (!child.name) {
        return false;
      }

      if (child.name === "thrustEffect") {
        return true;
      }
    });

    if (!slot) {
      return new Vector();
    }

    return new Vector(slot.position);
  }

  async create() {
    const scene = await torpedoMesh;

    const torpedo = scene.object.children[0].clone();

    this.torpedo = torpedo;

    const enginePosition = this.getEnginePosition();

    this.particleEmitter
      .getMesh()
      .position.set(enginePosition.x, enginePosition.y, enginePosition.z);

    this.object.add(torpedo);

    this.createParticleEffect();
  }

  private createParticleEffect() {
    this.particleEmitter.freeAllParticles();
    const visuals = this.torpedoFlight.torpedo.visuals;
    const color = new THREE.Color(
      visuals.engineColor[0],
      visuals.engineColor[1],
      visuals.engineColor[2]
    );

    //this.torpedo.position.x = 100;
    //this.torpedo.position.z = 50;

    /*
    this.line = new Line(this.object, {
      start: new Vector(0, 0, 0),
      end: new Vector(0, 0, -30),
      width: 0.5,
      color: new THREE.Color(1, 1, 1),
      opacity: 0.2
      //type: "cylinder"
    });
    */

    const getRandom = getSeededRandomGenerator(this.torpedoFlight.id);

    const size = 10;
    const sineFrequency = getRandom() * 20 + 50;

    this.particleEmitter
      .forceGetParticle()
      .setSize(size)
      .setOpacity(0.5)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(color)
      //.setVelocity(this.movement)
      .setPosition({
        x: 0,
        y: 0,
        z: 0,
      })
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(0);
    //.setSine(100, 0.99);

    this.particleEmitter
      .forceGetParticle()
      .setSize(size)
      .setOpacity(0.1)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(color)
      //.setVelocity(this.movement)
      .setPosition({
        x: 0,
        y: 0,
        z: 0,
      })
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(0)
      .setSine(sineFrequency, 0.99);

    this.particleEmitter
      .forceGetParticle()
      .setSize(size * 0.5)
      .setOpacity(0.5)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(new THREE.Color(1, 1, 1))
      //.setVelocity(this.movement)
      .setPosition({
        x: -0.25,
        y: 0,
        z: 0.05,
      })
      .setTexture(PARTICLE_TEXTURE.BOLT)
      .setAngle(addToDirection(this.facing, -90), 0)
      .setActivationTime(0);

    this.particleEmitter
      .forceGetParticle()
      .setSize(size * 1)
      .setOpacity(0.5)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(new THREE.Color(1, 1, 1))
      //.setVelocity(this.movement)
      .setPosition({
        x: -0.25,
        y: 0,
        z: 0.05,
      })
      .setTexture(PARTICLE_TEXTURE.BOLT)
      .setAngle(addToDirection(this.facing, -90), 0)
      .setActivationTime(0);

    this.particleEmitter
      .forceGetParticle()
      .setSize(size * 2)
      .setOpacity(0.5)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(color)
      //.setVelocity(this.movement)
      .setPosition({
        x: -2,
        y: 0,
        z: 0,
      })
      .setTexture(PARTICLE_TEXTURE.BOLT)
      .setSine(sineFrequency, 0.5)
      .setAngle(addToDirection(this.facing, -90), 0)
      .setActivationTime(0);

    let angle = 90;
    const angleChange = 0;
    //getRandom() * 0.5 - 0.25;

    angle += 90;

    this.particleEmitter
      .forceGetParticle()
      .setActivationTime(0)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setSize(getRandom() * 10 + size * 5)
      .setOpacity(getRandom() * 0.05 + 0.2)
      .setPosition({
        x: 0,
        y: 0,
        z: 0,
      })
      .setColor(new THREE.Color(51 / 255, 163 / 255, 255 / 255))
      //.setSine(getRandom() * 200 + 100, 0.1)
      .setAngle(angle, angleChange)
      .setTexture(PARTICLE_TEXTURE.STARLINE)
      .setSine(100, 0.5);

    this.particleEmitter
      .forceGetParticle()
      .setActivationTime(0)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setSize(getRandom() * 10 + size * 6)
      .setOpacity(0.1)
      .setPosition({
        x: 0,
        y: 0,
        z: 0,
      })
      .setColor(color)
      //.setSine(getRandom() * 200 + 100, 0.1)
      .setAngle(angle, angleChange)
      .setTexture(PARTICLE_TEXTURE.STARLINE)
      .setSine(sineFrequency, 0.99);
  }

  render({ zoom }: RenderPayload) {
    if (this.lastAnimationTime === null) {
      this.lastAnimationTime = Date.now();
    }

    const deltaTime = Date.now() - this.lastAnimationTime;

    this.totalAnimationTime += deltaTime;

    this.particleEmitter.render({
      delta: 0,
      total: this.totalAnimationTime,
      last: 0,
      zoom: zoom,
      paused: false,
      reverse: false,
    });

    this.lastAnimationTime = Date.now();
  }

  destroy() {
    this.scene.remove(this.object);
  }

  update(torpedoFlight: TorpedoFlight) {
    this.torpedoFlight = torpedoFlight;
  }
}

export default TorpedoObject;
