import ParticleEmitter from "./ParticleEmitter";
import { StarParticleEmitter } from ".";
import BoltInstanceFactory from "./BoltParticleEmitter/BoltInstanceFactory";
import Vector from "../../../../../model/utils/Vector.mjs";
import * as THREE from "three";

class ParticleEmitterContainer {
  constructor(scene, defaultParticleAmount) {
    this.scene = scene;
    this.defaultParticleAmount = defaultParticleAmount;

    this.boltInstanceFactory = new BoltInstanceFactory(this.scene);

    this.reservations = [];

    this.emitters = {
      star: [],
      bolt: [],
      effect: [],
      normal: [],
    };

    this._isReady = false;
    this.readyPromise = new Promise(async (resolve) => {
      await this.boltInstanceFactory.ready;
      this._isReady = true;
      resolve(true);
    });

    this.position = new Vector();
  }

  ready() {
    return this.readyPromise;
  }

  isReady() {
    return this._isReady;
  }

  createParticleEmitter(type) {
    switch (type) {
      case "star":
        return this.createStarParticleEmitter();
      case "bolt":
        return this.createBoltParticleEmitter();
      case "normal":
        return this.createNormalParticleEmitter();
      case "effect":
      default:
        return this.createEffectParticleEmitter();
    }
  }

  createStarParticleEmitter() {
    const emitter = new StarParticleEmitter(
      this.scene,
      this.defaultParticleAmount
    );
    emitter.setPosition(this.position);
    return emitter;
  }

  createEffectParticleEmitter() {
    const emitter = new ParticleEmitter(this.scene, this.defaultParticleAmount);
    emitter.setPosition(this.position);
    return emitter;
  }

  createNormalParticleEmitter() {
    const emitter = new ParticleEmitter(
      this.scene,
      this.defaultParticleAmount,
      { blending: THREE.NormalBlending }
    );
    emitter.setPosition(this.position);
    return emitter;
  }

  createBoltParticleEmitter() {
    const emitter = this.boltInstanceFactory.create(this.defaultParticleAmount);
    emitter.setParentPosition(this.position);
    return emitter;
  }

  getParticle(reserver, type = "effect") {
    let emitter = this.emitters[type].find((emitter) => emitter.hasFree());

    if (!emitter) {
      emitter = this.createParticleEmitter(type);
      this.emitters[type].push(emitter);
    }

    const particle = emitter.getParticle();

    this.reservations.push({ reserver, emitter, index: particle.index });

    return particle;
  }

  getStarParticle(reserver) {
    return this.getParticle(reserver, "star");
  }

  getBoltParticle(reserver) {
    return this.getParticle(reserver, "bolt");
  }

  getEffectParticle(reserver) {
    return this.getParticle(reserver, "effect");
  }

  getNormalParticle(reserver) {
    return this.getParticle(reserver, "normal");
  }

  setPosition(position) {
    this.position = position;
    this.emitters.bolt.forEach((emitter) =>
      emitter.setParentPosition(position)
    );
    this.emitters.star.forEach((emitter) => emitter.setPosition(position));
    this.emitters.effect.forEach((emitter) => emitter.setPosition(position));
    this.emitters.normal.forEach((emitter) => emitter.setPosition(position));
  }

  cleanUp() {
    this.emitters.star.forEach((emitter) => {
      emitter.cleanUp();
    });

    this.emitters.bolt.forEach((emitter) => {
      emitter.cleanUp();
    });

    this.emitters.effect.forEach((emitter) => {
      emitter.cleanUp();
    });

    this.emitters.normal.forEach((emitter) => {
      emitter.cleanUp();
    });

    this.emitters = {
      star: [],
      bolt: [],
      effect: [],
      normal: [],
    };
  }

  release(reserver) {
    this.reservations.forEach((reservation) => {
      if (reservation.reserver === reserver) {
        reservation.emitter.freeParticles(reservation.index);
      }
    });
  }

  render(payload) {
    this.emitters.star.forEach((emitter) => {
      emitter.render(payload);
    });

    this.emitters.effect.forEach((emitter) => {
      emitter.render(payload);
    });

    this.emitters.normal.forEach((emitter) => {
      emitter.render(payload);
    });

    this.boltInstanceFactory.render(payload);
  }
}

export default ParticleEmitterContainer;
