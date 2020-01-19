import { loadObject, cloneObject } from "../../utils/objectLoader";
import LineSprite from "../sprite/LineSprite";
import Vector from "../../../../../model/utils/Vector.mjs";
import Line from "../Line";
import * as THREE from "three";
import StarParticleEmitter from "../../animation/particle/StarParticleEmitter";
import { ParticleEmitter } from "../../animation/particle";
import {
  TEXTURE_GLOW,
  TEXTURE_STARLINE,
  TEXTURE_GAS
} from "../../animation/particle/BaseParticle";
import { getSeededRandomGenerator } from "../../../../../model/utils/math.mjs";
import { degreeToRadian } from "../../../../../model/utils/math.mjs";

const torpedoMesh = loadObject("/img/3d/torpedo/scene.gltf");

class TorpedoObject {
  constructor(torpedoFlight, scene) {
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

  setFacing(facing) {
    this.object.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      degreeToRadian(facing)
    );
  }

  setPosition(position) {
    this.object.position.set(position.x, position.y, position.z);
    return this;
  }

  getEnginePosition() {
    const slot = this.torpedo.children.find(child => {
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

    const torpedo = scene.scene.children[0].clone();

    this.torpedo = torpedo;

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

    const enginePosition = this.getEnginePosition();

    this.particleEmitter.mesh.position.set(
      enginePosition.x,
      enginePosition.y,
      enginePosition.z
    );
    const getRandom = getSeededRandomGenerator(this.torpedoFlight.id);

    const size = 10;
    const sineFrequency = getRandom() * 50 + 200;

    this.particleEmitter
      .getParticle()
      .setSize(size)
      .setOpacity(0.5)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(color)
      //.setVelocity(this.movement)
      .setPosition({
        x: 0,
        y: 0,
        z: 0
      })
      .setTexture(TEXTURE_GLOW)
      .setActivationTime(0);
    //.setSine(100, 0.99);

    this.particleEmitter
      .getParticle()
      .setSize(size)
      .setOpacity(0.1)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(color)
      //.setVelocity(this.movement)
      .setPosition({
        x: 0,
        y: 0,
        z: 0
      })
      .setTexture(TEXTURE_GLOW)
      .setActivationTime(0)
      .setSine(sineFrequency, 0.99);

    this.particleEmitter
      .getParticle()
      .setSize(size * 0.3)
      .setOpacity(0.8)
      .setFadeIn(0, 0)
      .setFadeOut(0, 0)
      .setColor(new THREE.Color(1, 1, 1))
      //.setVelocity(this.movement)
      .setPosition({
        x: 0,
        y: 0,
        z: 0
      })
      .setTexture(TEXTURE_GLOW)
      .setActivationTime(0);

    let angle = 90;
    let shines = 2;
    let angleChange = 0; // getRandom() * 0.05 - 0.025;

    while (shines--) {
      angle += 90;

      /*
      this.particleEmitter
        .getParticle()
        .setActivationTime(0)
        .setFadeIn(0, 0)
        .setFadeOut(0, 0)
        .setSize(getRandom() * 10 + size * 5)
        .setOpacity(getRandom() * 0.05 + 0.2)
        .setPosition({
          x: 0,
          y: 0,
          z: 0
        })
        .setColor(new THREE.Color(51 / 255, 163 / 255, 255 / 255))
        //.setSine(getRandom() * 200 + 100, 0.1)
        .setAngle(angle)
        .setAngleChange(angleChange)
        .setTexture(TEXTURE_STARLINE);
      //.setSine(100, 0.5);
      */

      this.particleEmitter
        .getParticle()
        .setActivationTime(0)
        .setFadeIn(0, 0)
        .setFadeOut(0, 0)
        .setSize(getRandom() * 10 + size * 3)
        .setOpacity(0.1)
        .setPosition({
          x: 0,
          y: 0,
          z: 0
        })
        .setColor(color)
        //.setSine(getRandom() * 200 + 100, 0.1)
        .setAngle(angle)
        .setAngleChange(angleChange)
        .setTexture(TEXTURE_STARLINE)
        .setSine(sineFrequency, 0.99);
    }

    this.object.add(torpedo);
  }

  render({ zoom }) {
    if (this.lastAnimationTime === null) {
      this.lastAnimationTime = Date.now();
    }

    var deltaTime = Date.now() - this.lastAnimationTime;

    this.totalAnimationTime += deltaTime;

    this.particleEmitter.render({
      delta: 0,
      total: this.totalAnimationTime,
      last: 0,
      zoom: zoom
    });

    this.lastAnimationTime = Date.now();
  }

  destroy() {
    this.scene.remove(this.object);
  }

  update(torpedoFlight) {
    this.torpedoFlight = torpedoFlight;
  }
}

export default TorpedoObject;
