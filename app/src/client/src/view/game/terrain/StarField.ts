import * as THREE from "three";
import { ParticleEmitterContainer } from "../animation/particle";
import { getSeededRandomGenerator } from "@fieryvoid3/model/src/utils/math";
import { PARTICLE_TEXTURE } from "../animation/particle/BaseParticle";

class StarField {
  private starCount: number;
  private emitterContainer: ParticleEmitterContainer;
  private lastAnimationTime: number = 0;
  private totalAnimationTime: number;
  private zoomChanged: number;
  private gameId: number;
  private getRandom: () => number;

  constructor(scene: THREE.Object3D, gameId: number) {
    this.starCount = 5000;
    this.emitterContainer = new ParticleEmitterContainer(scene, this.starCount);
    this.totalAnimationTime = 0;
    this.zoomChanged = 0;
    this.gameId = gameId;

    this.getRandom = Math.random;

    this.create();
  }

  async create() {
    await this.emitterContainer.getReady();
    //this.scene.background = new THREE.Color(10 / 255, 10 / 255, 30 / 255);

    //this.webglScene.scene.background = new THREE.Color(10/255, 10/255, 30/255);
    const width = 3000; //this.webglScene.width * 1.5;
    const height = 2000; // this.webglScene.height * 1.5;

    this.getRandom = getSeededRandomGenerator(this.gameId.toString());

    //var stars = Math.floor(this.starCount * (width / 4000));
    let stars = this.starCount;
    while (stars--) {
      this.createStar(width, height);

      if (this.getRandom() > 0.98) {
        this.createShiningStar(width, height);
      }
    }

    //var gas = Math.floor(this.getRandom() * 5) + 8;

    /*
        while(gas--){
            this.createGasCloud(width, height)
        }
        */

    this.lastAnimationTime = new Date().getTime();
    this.totalAnimationTime = 0;
    this.zoomChanged = 1;
    return this;
  }

  resize() {}

  cleanUp() {
    this.emitterContainer.release(this);
  }

  render() {
    if (!this.emitterContainer.isReady()) {
      return;
    }

    const deltaTime = new Date().getTime() - this.lastAnimationTime;
    this.totalAnimationTime += deltaTime;
    this.emitterContainer.render({
      delta: 0,
      total: this.totalAnimationTime,
      last: 0,
      zoom: this.zoomChanged,
      reverse: false,
      paused: false,
    });

    if (this.zoomChanged === 1) {
      this.zoomChanged = 0;
    }

    this.lastAnimationTime = new Date().getTime();
  }

  createStar(width: number, height: number) {
    const particle = this.emitterContainer.getStarParticle(this);

    const x = (this.getRandom() - 0.5) * width * 1.5;
    const y = (this.getRandom() - 0.5) * height * 1.5;

    particle
      .setActivationTime(0)
      .setSize(2 + this.getRandom() * 2)
      .setOpacity(this.getRandom() * 0.2 + 0.9)
      .setPosition({ x: x, y: y, z: 0 })
      .setColor(new THREE.Color(1, 1, 1))
      .setParallaxFactor(0.1 + this.getRandom() * 0.1);

    if (this.getRandom() > 0.9) {
      particle
        .setSineFrequency(this.getRandom() * 200 + 50)
        .setSineAmplitude(this.getRandom());
    }
  }

  createShiningStar(width: number, height: number) {
    let particle = this.emitterContainer.getStarParticle(this);

    const x = (this.getRandom() - 0.5) * width * 1.5;
    const y = (this.getRandom() - 0.5) * height * 1.5;

    const size = 6 + this.getRandom() * 6;
    const parallaxFactor = 0.1 + this.getRandom() * 0.1;
    const color = new THREE.Color(
      this.getRandom() * 0.4 + 0.6,
      this.getRandom() * 0.2 + 0.8,
      this.getRandom() * 0.4 + 0.6
    );

    particle
      .setActivationTime(0)
      .setSize(size * 0.5)
      .setOpacity(this.getRandom() * 0.2 + 0.9)
      .setPosition({ x: x, y: y, z: 0 })
      .setColor(new THREE.Color(1, 1, 1))
      .setParallaxFactor(parallaxFactor);

    particle = this.emitterContainer.getStarParticle(this);
    particle
      .setActivationTime(0)
      .setSize(size)
      .setOpacity(this.getRandom() * 0.1 + 0.1)
      .setPosition({ x: x, y: y, z: 0 })
      .setColor(color)
      .setParallaxFactor(parallaxFactor)
      .setSineFrequency(this.getRandom() * 200 + 100)
      .setSineAmplitude(this.getRandom() * 0.4);

    let shines = Math.round(this.getRandom() * 8) - 3;

    if (shines <= 2) {
      return;
    }

    let angle = this.getRandom() * 360;
    const angleChange = (this.getRandom() - 0.5) * 0.01;

    while (shines--) {
      angle += this.getRandom() * 60 + 40;
      particle = this.emitterContainer.getStarParticle(this);
      particle
        .setActivationTime(0)
        .setSize(size * this.getRandom() * 10 + 10)
        .setOpacity(this.getRandom() * 0.1 + 0.1)
        .setPosition({ x: x, y: y, z: 0 })
        .setColor(color)
        .setParallaxFactor(parallaxFactor)
        .setSineFrequency(this.getRandom() * 200 + 100)
        .setSineAmplitude(0.1)
        .setAngle(angle)
        .setAngleChange(angleChange)
        .setTexture(PARTICLE_TEXTURE.STARLINE);
    }
  }

  createGasCloud(width: number, height: number) {
    const position = {
      x: (this.getRandom() - 0.5) * width,
      y: (this.getRandom() - 0.5) * height,
    };

    const vector = {
      x: (this.getRandomBand(0.5, 1) * width) / 100,
      y: (this.getRandomBand(0.5, 1) * width) / 100,
    };

    let iterations = Math.floor(this.getRandom() * 3) + 5;

    while (iterations--) {
      this.createGasCloudPart({ x: position.x, y: position.y }, width);
      position.x += this.getRandomBand(0, 1) * 50 + vector.x;
      position.y += this.getRandomBand(0, 1) * 50 + vector.y;
    }
  }

  getRandomBand(min: number, max: number) {
    const random = this.getRandom() * (max - min) + min;
    return this.getRandom() > 0.5 ? random * -1 : random;
  }

  createGasCloudPart(position: { x: number; y: number }, width: number) {
    let gas = Math.floor(this.getRandom() * 5 + 5);
    const baseRotation = (this.getRandom() - 0.5) * 0.002;

    while (gas--) {
      this.createGas(
        position,
        baseRotation,
        this.getRandom() * width * 0.4 + width * 0.4
      );
    }
  }

  createGas(
    position: { x: number; y: number },
    baseRotation: number,
    size: number
  ) {
    const particle = this.emitterContainer.getStarParticle(this);

    position.x += (this.getRandom() - 0.5) * 100;
    position.y += (this.getRandom() - 0.5) * 100;

    particle
      .setActivationTime(0)
      .setSize(this.getRandom() * size * 0.5 + size * 0.5)
      .setOpacity(this.getRandom() * 0.005 + 0.005)
      .setPosition({ x: position.x, y: position.y, z: 0 })
      .setColor(new THREE.Color(104 / 255, 204 / 255, 249 / 255))
      .setTexture(PARTICLE_TEXTURE.GAS)
      .setAngle(this.getRandom() * 360)
      .setAngleChange(baseRotation + (this.getRandom() - 0.5) * 0.001)
      .setParallaxFactor(0.1 + this.getRandom() * 0.1);

    if (this.getRandom() > 0.9) {
      particle
        .setActivationTime(0)
        .setSize(this.getRandom() * size * 0.25 + size * 0.25)
        .setOpacity(0)
        .setPosition({ x: position.x, y: position.y, z: 0 })
        .setColor(new THREE.Color(1, 1, 1))
        .setTexture(PARTICLE_TEXTURE.GAS)
        .setAngle(this.getRandom() * 360)
        .setAngleChange(baseRotation + (this.getRandom() - 0.5) * 0.01)
        .setParallaxFactor(0.1 + this.getRandom() * 0.1)
        .setSineFrequency(this.getRandom() * 200 + 200)
        .setSineAmplitude(this.getRandom() * 0.02);
    }
  }
}

export default StarField;
