import BaseParticle, {
  TEXTURE_GAS,
  TEXTURE_BOLT,
  TEXTURE_GLOW,
  TEXTURE_RING,
  TEXTURE_STARLINE
} from "../particle/BaseParticle";
import Animation from "../Animation";
import { getPointInDirection } from "../../../../../model/utils/math.mjs";
import * as THREE from "three";

class ExplosionEffect extends Animation {
  constructor(emitterContainer, getRandom, args = {}) {
    super(getRandom);

    this.emitterContainer = emitterContainer;
    this.position = args.position || { x: 0, y: 0 };
    this.time = args.time || 0;
    this.type = args.type || "gas";
    this.size = args.size || 16;
    this.speed = args.speed || 1;
    this.ring = args.ring || false;
    this.duration = args.duration;
    this.color = args.color;

    this.movement = args.velocity || { x: 0, y: 0, z: 0 };
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
    var amount = 3;

    this.createMainGlow(amount, this.size);
    this.createCore(this.size, TEXTURE_GLOW);
    this.createWhiteCenter(this.size * 2, 0.8);
  }

  createGas() {
    var amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    var shootoffs = Math.ceil(Math.random() * 20 + 10);

    this.createShootOffs(shootoffs, this.size);
    this.createMainGlow(Math.ceil(amount / 2), this.size);
    this.createCore(this.size, TEXTURE_GLOW);
    this.createMain(amount, this.size);
    this.createWhiteCenter(this.size * 2, 0.5);
  }

  createPillar() {
    //if ( this.ring)
    //	this.createRing(this.size, emitter);

    var amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    var shootoffs = Math.ceil(Math.random() * 20 + 10);

    this.createPillars(shootoffs, this.size);
    this.createMainGlow(Math.ceil(amount / 2), this.size);
  }

  createEMP() {
    //if ( this.ring)
    //	this.createRing(this.size, emitter);

    var amount = Math.ceil(this.size / 4);
    if (amount > 6) {
      amount = 6;
    }

    this.createEmpGlow(Math.ceil(amount / 2), this.size);
    this.createWhiteCenter(this.size * 4, 0.5);
    this.createEmpCore(this.size, TEXTURE_GAS);
  }

  createWhiteCenter(size, opacity) {
    if (!opacity) {
      opacity = 1.0;
    }

    var activation = this.time;
    var fadeInSpeed = 100;
    var fadeOutAt = activation + fadeInSpeed;
    //amount = 1;

    this.emitterContainer
      .getParticle(this)
      .setSize(size / 4)
      //.setSizeChange(128)
      .setOpacity(opacity)
      .setFadeIn(activation, fadeInSpeed)
      .setFadeOut(fadeOutAt, 500)
      .setColor({ r: 1, g: 1, b: 1 })
      .setPosition({
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      })
      .setTexture(TEXTURE_GLOW)
      .setActivationTime(activation);
  }

  createShootOffs(amount, radius, args) {
    while (amount--) {
      this.createShootOff(radius, args);
    }
  }

  createShootOff(radius, args) {
    if (!args) {
      args = {};
    }

    var size = radius;

    var particle = this.emitterContainer.getParticle(this);
    var activationTime =
      this.time + Math.floor((Math.random() * 30) / this.speed);
    var fadeInSpeed = args.fadeInSpeed || Math.random() * 50 + 25;
    var fadeOutAt =
      args.fadeOutAt ||
      activationTime + Math.floor((Math.random() * 50) / this.speed);
    var fadeOutSpeed =
      args.fadeOutSpeed ||
      (Math.random() * 500) / this.speed + 250 / this.speed;
    var angle = args.angle || Math.floor(Math.random() * 360);
    var speed = (Math.random() * 0.2 + 0.1) * this.speed * this.size * 0.01;

    var target = args.target || getPointInDirection(speed, -angle, 0, 0, true);
    var position = args.position || this.position; //getPointInDirection(size/2, angle, this.position.x, this.position.y, true);
    var color = args.color || getYellowColor();

    particle
      .setSize(Math.floor((Math.random() * size) / 2) + size / 2)
      .setOpacity(Math.random() * 0.8 + 0.2)
      .setFadeIn(activationTime, fadeInSpeed)
      .setFadeOut(fadeOutAt, fadeOutSpeed)
      .setColor(color)
      .setPosition({ x: position.x, y: position.y })
      .setVelocity(target)
      .setAngle(angle)
      .setTexture(TEXTURE_BOLT)
      .setActivationTime(activationTime);
  }

  createPillars(amount, radius) {
    var size = radius;
    //amount = 1;
    while (amount--) {
      var particle = this.emitterContainer.getParticle(this);
      var activationTime =
        this.time + Math.floor((Math.random() * 30) / this.speed);
      var fadeOutAt =
        activationTime + Math.floor((Math.random() * 50) / this.speed);

      var angle = Math.floor(Math.random() * 360);
      var target = getPointInDirection(0.1, -angle, 0, 0);

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
          z: this.position.z
        })
        .setVelocity(target)
        .setAngle(angle)
        .setTexture(TEXTURE_BOLT)
        .setActivationTime(activationTime);

      this.createShootOff(radius, {
        angle: angle,
        activationTime: activationTime
      });
    }
  }

  createCore(radius, texture) {
    var size = radius;

    var particle = this.emitterContainer.getParticle(this);
    var activationTime = this.time + (Math.random() * 0.005) / this.speed;
    var fadeOutAt =
      activationTime + (Math.random() * 0.02) / this.speed + 0.03 / this.speed;

    particle
      .setSize(Math.floor((Math.random() * size) / 2) + size)
      .setOpacity(Math.random() * 0.2 + 0.6)
      .setFadeIn(activationTime, Math.random() * 0.005 + 0.0025)
      .setFadeOut(
        fadeOutAt,
        (Math.random() * 0.05) / this.speed + 0.025 / this.speed
      )
      .setColor(getCoreColor())
      .setPosition({
        x: this.position.x, // + Math.floor(Math.random()*radius/10)-radius/5,
        y: this.position.y, // + Math.floor(Math.random()*radius/10)-radius/5,
        z: this.position.z
      })
      .setAngle(45)
      .setTexture(texture)
      .setVelocity(this.movement)
      .setAngle(Math.floor(Math.random() * 360))
      .setAngleChange(
        Math.floor(Math.random() * 20 * this.speed) - 10 * this.speed
      )
      .setActivationTime(activationTime);
  }

  createEmpGlow(amount, radius) {
    var size = radius * 2;
    while (amount--) {
      var particle = this.emitterContainer.getParticle(this);
      var activationTime = this.time;
      var fadeOutAt = activationTime;

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
          z: this.position.z
        })
        .setTexture(TEXTURE_GLOW)
        .setActivationTime(activationTime);
    }
  }

  createEmpCore(radius, texture) {
    var size = radius;

    var particle = this.emitterContainer.getParticle(this);
    var activationTime = this.time;
    var fadeOutAt = activationTime;

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
        z: this.position.z
      })
      .setAngle(45)
      .setTexture(texture)
      .setVelocity(this.movement)
      .setAngle(Math.floor(Math.random() * 360))
      .setAngleChange(5 * this.speed)
      .setActivationTime(activationTime);
  }

  createMain(amount, radius) {
    var size = radius;
    while (amount--) {
      var particle = this.emitterContainer.getParticle(this);
      var activationTime =
        this.time + Math.floor((Math.random() * 300) / this.speed);
      var fadeOutAt =
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
          z: this.position.z + (Math.floor(Math.random() * radius) - radius) / 8
        })
        .setVelocity(this.movement)
        .setAngle(Math.floor(Math.random() * 360))
        //.setAngleChange(Math.floor(Math.random()*2*this.speed)-1*this.speed)
        .setActivationTime(activationTime)
        .setTexture(TEXTURE_GAS);
    }
  }

  createMainGlow(amount, radius) {
    var size = radius * 2;
    while (amount--) {
      var particle = this.emitterContainer.getParticle(this);
      var activationTime =
        this.time + Math.floor((Math.random() * 0.03) / this.speed);
      var fadeOutAt = this.duration
        ? activationTime + this.duration
        : activationTime + Math.floor((Math.random() * 0.05) / this.speed);

      particle
        .setSize(Math.floor((Math.random() * size) / 2) + size)
        .setOpacity(Math.random() * 0.1 + 0.4)
        .setFadeIn(activationTime, Math.random() * 0.005 + 0.0025)
        .setFadeOut(fadeOutAt, (Math.random() * 200 + 800) / this.speed)
        .setColor(this.getRandomColor())
        .setVelocity(this.movement)
        .setPosition({
          x: this.position.x,
          y: this.position.y,
          z: this.position.z
        })
        .setTexture(TEXTURE_GLOW)
        .setActivationTime(activationTime);
    }
  }

  getRandomColor = function() {
    if (this.color) {
      return this.color;
    }

    return new THREE.Color().setRGB(
      1,
      (255 - Math.floor(Math.random() * 155)) / 255,
      Math.floor(Math.random() * 155) / 255
    );
  };

  getSmokeColor = function() {
    var c = (Math.random() * 50 + 20) / 255;
    return new THREE.Color().setRGB(c, c, c + 0.05);
  };

  deactivate() {
    this.emitterContainer.release(this);
  }
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
