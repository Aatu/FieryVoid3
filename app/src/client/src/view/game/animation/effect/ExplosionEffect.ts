import Animation from "../Animation";
import * as THREE from "three";
import BoltEffect from "./BoltEffect";
import { ParticleEmitterContainer } from "../particle";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { PARTICLE_TEXTURE } from "../particle/BaseParticle";
import { getPointInDirection } from "@fieryvoid3/model/src/utils/math";

const boltEffect = new BoltEffect();

type ExplosionEffectArgs = {
  position?: IVector;
  time?: number;
  type?: string;
  size?: number;
  speed?: number;
  ring?: boolean;
  duration?: number;
  color?: THREE.Color;
  opacity?: number;
  repeat?: number;
  velocity?: IVector;
  target?: IVector;
  fadeOutSpeed?: number;
};

class ExplosionEffect extends Animation {
  private emitterContainer: ParticleEmitterContainer;
  private position: IVector;
  public time: number;
  private type: string;
  private size: number;
  private speed: number;
  private ring: boolean;
  public duration: number;
  private color: THREE.Color;
  private opacity: number;
  private repeat: number;
  private movement: IVector;
  private context: unknown;

  constructor(
    emitterContainer: ParticleEmitterContainer,
    getRandom: () => number,
    args: ExplosionEffectArgs = {},
    context: unknown
  ) {
    super(getRandom);

    this.emitterContainer = emitterContainer;
    this.position = args.position || new Vector();
    this.time = args.time || 0;
    this.type = args.type || "gas";
    this.size = args.size || 16;
    this.speed = args.speed || 1;
    this.ring = args.ring || false;
    this.duration = args.duration || 0;
    this.color = args.color || new THREE.Color();
    this.opacity = args.opacity || 1;
    this.repeat = args.repeat || 0;

    this.movement = args.velocity || new Vector();

    this.context = context;
    this.create();
  }

  create() {
    switch (this.type) {
      case "gas":
        this.createGas();
        break;

      case "glow":
        this.createGlow();
        break;

      case "emp":
        this.createEMP();
        break;

      case "pillar":
        this.createPillar();
        break;
      default:
        this.createGas();
        break;
    }
  }

  createGlow() {
    const amount = 3;

    this.createMainGlow(amount, this.size);
    this.createCore(this.size, PARTICLE_TEXTURE.GLOW);
    this.createWhiteCenter(this.size * 2, 0.8);
  }

  createGas() {
    let amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    const shootoffs = Math.ceil(Math.random() * 20 + 10);

    this.createShootOffs(shootoffs, this.size);
    this.createMainGlow(1, this.size);
    this.createCore(this.size, PARTICLE_TEXTURE.GLOW);
    this.createMain(amount, this.size);
    this.createWhiteCenter(this.size * 2, 0.5);
  }

  createPillar() {
    //if ( this.ring)
    //	this.createRing(this.size, emitter);

    let amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    const shootoffs = Math.ceil(Math.random() * 20 + 10);

    this.createPillars(shootoffs, this.size);
    this.createMainGlow(Math.ceil(amount / 2), this.size);
  }

  createEMP() {
    //if ( this.ring)
    //	this.createRing(this.size, emitter);

    let amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    this.createEmpGlow(Math.ceil(amount / 2), this.size);
    this.createWhiteCenter(this.size * 4, 0.5);
    this.createEmpCore(this.size, PARTICLE_TEXTURE.GAS);
  }

  createWhiteCenter(size: number, opacity: number) {
    if (!opacity) {
      opacity = 1.0;
    }

    const activation = this.time;
    const fadeInSpeed = 100;
    const fadeOutAt = activation + fadeInSpeed;
    //amount = 1;

    this.emitterContainer
      .getEffectParticle(this.context)
      .setSize(size / 4)
      //.setSizeChange(128)
      .setOpacity(opacity * this.opacity)
      .setFadeIn(activation, fadeInSpeed)
      .setFadeOut(fadeOutAt, 500)
      .setColor({ r: 1, g: 1, b: 1 })
      .setPosition({
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      })
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(activation)
      .setRepeat(this.repeat)
      .setVelocity(this.movement);
  }

  createShootOffs(
    amount: number,
    radius: number,
    args: ExplosionEffectArgs = {}
  ) {
    while (amount--) {
      this.createShootOff(radius, args);
    }
  }

  createShootOff(
    radius: number,
    args: {
      angle?: number;
      activationTime?: number;
      fadeOutSpeed?: number;
      target?: IVector;
      position?: IVector;
    } = {}
  ) {
    if (!args) {
      args = {};
    }

    const speed = (Math.random() * 0.2 + 0.1) * this.speed * this.size * 0.01;

    const startPosition = args.position || this.position;
    const endPosition =
      args.target ||
      new Vector(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar((Math.random() * 10 + 3) * this.size)
        .add(startPosition);

    const color = this.getRandomColor();
    boltEffect.create(
      this.time + Math.floor((Math.random() * 30) / this.speed),
      new Vector(startPosition),
      new Vector(endPosition),
      speed * 1.5,
      args.fadeOutSpeed || Math.random() * 500 + 250,
      Math.floor(Math.random() * 500 + 250) / this.speed,
      {
        size: radius / 3,
        color: [color.r, color.g, color.b],
        coreOpacity: 0.1,
        repeat: this.repeat,
      },
      this.getRandom,
      this.emitterContainer,
      this.context
    );
  }

  createPillars(amount: number, radius: number) {
    const size = radius;
    //amount = 1;

    while (amount--) {
      const particle = this.emitterContainer.getEffectParticle(this.context);
      const activationTime =
        this.time + Math.floor((Math.random() * 30) / this.speed);
      const fadeOutAt =
        activationTime + Math.floor((Math.random() * 50) / this.speed);

      const angle = Math.floor(Math.random() * 360);
      const target = getPointInDirection(0.1, -angle, 0, 0);

      particle
        .setSize(Math.floor(Math.random() * size) + size / 2)
        .setOpacity(Math.random() * 0.1 + 0.9)
        .setFadeIn(activationTime, Math.random() * 50 + 25)
        .setFadeOut(
          fadeOutAt,
          (Math.random() * 500) / this.speed + 250 / this.speed
        )
        .setColor(getYellowColor())
        .setPosition({
          x: this.position.x,
          y: this.position.y,
          z: this.position.z,
        })
        .setVelocity({ x: target.x, y: target.y, z: 0 })
        .setAngle(angle)
        .setTexture(PARTICLE_TEXTURE.BOLT)
        .setActivationTime(activationTime)
        .setRepeat(this.repeat);

      this.createShootOff(radius, {
        angle: angle,
        activationTime: activationTime,
      });
    }
  }

  createCore(radius: number, texture: PARTICLE_TEXTURE) {
    const size = radius;

    const particle = this.emitterContainer.getEffectParticle(this.context);
    const activationTime = this.time + (Math.random() * 0.005) / this.speed;
    const fadeOutAt =
      activationTime + (Math.random() * 0.02) / this.speed + 0.03 / this.speed;

    particle
      .setSize(Math.floor((Math.random() * size) / 2) + size)
      .setOpacity(Math.random() * 0.2 + 0.6)
      .setFadeIn(activationTime, Math.random() * 0.005 + 0.0025)
      .setFadeOut(
        fadeOutAt,
        (Math.random() * 0.05) / this.speed + 0.025 / this.speed
      )
      .setOpacity(this.opacity * 0.5)
      .setColor(getCoreColor())
      .setPosition({
        x: this.position.x, // + Math.floor(Math.random()*radius/10)-radius/5,
        y: this.position.y, // + Math.floor(Math.random()*radius/10)-radius/5,
        z: this.position.z,
      })
      .setAngle(45)
      .setTexture(texture)
      .setVelocity(this.movement)
      .setAngle(
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 20 * this.speed) - 10 * this.speed
      )

      .setActivationTime(activationTime)
      .setRepeat(this.repeat);
  }

  createEmpGlow(amount: number, radius: number) {
    const size = radius * 2;
    while (amount--) {
      const particle = this.emitterContainer.getEffectParticle(this.context);
      const activationTime = this.time;
      const fadeOutAt = activationTime;

      particle
        .setSize(size)
        .setSizeChange(0.004 * this.size)
        .setOpacity(Math.random() * 0.1 + 0.2)
        .setFadeIn(activationTime, Math.random() * 0.005 + 0.0025)
        .setFadeOut(fadeOutAt, (Math.random() * 200 + 800) / this.speed)
        .setColor({ r: 122 / 255, g: 221 / 255, b: 255 / 255 })
        .setVelocity(this.movement)
        .setPosition({
          x: this.position.x,
          y: this.position.y,
          z: this.position.z,
        })
        .setTexture(PARTICLE_TEXTURE.GLOW)
        .setActivationTime(activationTime)
        .setRepeat(this.repeat);
    }
  }

  createEmpCore(radius: number, texture: PARTICLE_TEXTURE) {
    const size = radius;

    const particle = this.emitterContainer.getEffectParticle(this.context);
    const activationTime = this.time;
    const fadeOutAt = activationTime;

    particle
      .setSize(size * 0.9)
      .setSizeChange(0.0039 * this.size)
      .setOpacity(Math.random() * 0.2 + 0.6)
      .setFadeIn(activationTime, 0.1)
      .setFadeOut(fadeOutAt, (Math.random() * 200 + 800) / this.speed)
      .setColor(getCoreColor())
      .setPosition({
        x: this.position.x, // + Math.floor(Math.random()*radius/10)-radius/5,
        y: this.position.y, // + Math.floor(Math.random()*radius/10)-radius/5,
        z: this.position.z,
      })
      .setAngle(45)
      .setTexture(texture)
      .setVelocity(this.movement)
      .setAngle(Math.floor(Math.random() * 360), 5 * this.speed)
      .setActivationTime(activationTime)
      .setRepeat(this.repeat);
  }

  createMain(amount: number, radius: number) {
    const size = radius;

    this.emitterContainer
      .getNormalParticle(this.context)
      .setSize(this.size)
      .setOpacity(1)
      .setFadeOut(this.time + 500)
      .setColor(getCoreColor())
      .setPosition({
        x: this.position.x + (Math.floor(Math.random() * radius) - radius) / 8,
        y: this.position.y + (Math.floor(Math.random() * radius) - radius) / 8,
        z: this.position.z + (Math.floor(Math.random() * radius) - radius) / 8,
      })
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(this.time);

    this.emitterContainer
      .getNormalParticle(this.context)
      .setSize(this.size * 2)
      .setOpacity(0.5)
      .setFadeOut(this.time + 500)
      .setColor(getYellowColor())
      .setPosition({
        x: this.position.x + (Math.floor(Math.random() * radius) - radius) / 8,
        y: this.position.y + (Math.floor(Math.random() * radius) - radius) / 8,
        z: this.position.z + (Math.floor(Math.random() * radius) - radius) / 8,
      })
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(this.time);

    while (amount--) {
      const particle = this.emitterContainer.getEffectParticle(this.context);
      const activationTime =
        this.time + Math.floor((Math.random() * 300) / this.speed);
      const fadeOutAt =
        activationTime + Math.floor((Math.random() * 500) / this.speed);

      particle
        .setSize(Math.floor(Math.random() * size) + size / 2)
        .setSizeChange(this.size * 0.003)
        .setOpacity(Math.random() * 0.1 + 0.05)
        .setFadeIn(activationTime, Math.random() * 50 + 25)
        .setFadeOut(
          fadeOutAt,
          (Math.random() * 500) / this.speed + 500 / this.speed
        )
        .setColor(this.getRandomColor())
        .setPosition({
          x:
            this.position.x + (Math.floor(Math.random() * radius) - radius) / 8,
          y:
            this.position.y + (Math.floor(Math.random() * radius) - radius) / 8,
          z:
            this.position.z + (Math.floor(Math.random() * radius) - radius) / 8,
        })
        .setVelocity(this.movement)
        .setAngle(Math.floor(Math.random() * 360))
        .setActivationTime(activationTime)
        .setTexture(PARTICLE_TEXTURE.GAS)
        .setRepeat(this.repeat);
    }
  }

  createMainGlow(amount: number, radius: number) {
    const size = radius * 2;

    while (amount--) {
      const particle = this.emitterContainer.getEffectParticle(this.context);
      const activationTime =
        this.time + Math.floor((Math.random() * 0.03) / this.speed);
      const fadeOutAt = this.duration
        ? activationTime + this.duration
        : activationTime + Math.floor((Math.random() * 0.05) / this.speed);

      particle
        .setSize(Math.floor((Math.random() * size) / 2) + size)
        .setOpacity(Math.random() * 0.1 + 0.4)
        .setFadeIn(activationTime, Math.random() * 0.005 + 0.0025)
        .setFadeOut(fadeOutAt, (Math.random() * 200 + 800) / this.speed)
        .setColor(this.getRandomColor())
        .setVelocity(this.movement)
        .setOpacity(this.opacity)
        .setPosition({
          x: this.position.x,
          y: this.position.y,
          z: this.position.z,
        })
        .setTexture(PARTICLE_TEXTURE.GLOW)
        .setActivationTime(activationTime)
        .setRepeat(this.repeat);
    }
  }

  getRandomColor() {
    if (this.color) {
      return this.color;
    }

    return new THREE.Color().setRGB(
      1,
      (155 - Math.floor(Math.random() * 75)) / 255,
      Math.floor(Math.random() * 155) / 255
    );
  }

  getSmokeColor() {
    const c = (Math.random() * 50 + 20) / 255;
    return new THREE.Color().setRGB(c, c, c + 0.05);
  }

  deactivate() {
    this.emitterContainer.release(this);
  }

  update(): void {}
  render(): void {}
}

const getCoreColor = () => {
  return new THREE.Color().setRGB(255, 255, 255);
};

const getYellowColor = () => {
  return new THREE.Color().setRGB(
    1,
    (Math.floor(Math.random() * 20) + 235) / 255,
    (Math.floor(Math.random() * 10) + 130) / 255
  );
};

export default ExplosionEffect;
