import Animation from "../Animation";
import ParticleEmitter from "./ParticleEmitter";
import { StarParticleEmitter } from ".";
import BoltInstanceFactory from "./BoltParticleEmitter/BoltInstanceFactory";

class ParticleEmitterContainer {
  constructor(scene, defaultParticleAmount) {
    this.scene = scene;
    this.defaultParticleAmount = defaultParticleAmount;

    this.boltInstanceFactory = new BoltInstanceFactory(this.scene);

    this.reservations = [];

    this.emitters = {
      star: [],
      bolt: [],
      effect: []
    };

    this._isReady = false;
    this.readyPromise = new Promise(async resolve => {
      await this.boltInstanceFactory.ready;
      this._isReady = true;
      resolve(true);
    });
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
      case "effect":
      default:
        return this.createEffectParticleEmitter();
    }
  }

  createStarParticleEmitter() {
    return new StarParticleEmitter(this.scene, this.defaultParticleAmount);
  }

  createEffectParticleEmitter() {
    return new ParticleEmitter(this.scene, this.defaultParticleAmount);
  }

  createBoltParticleEmitter() {
    return this.boltInstanceFactory.create(this.defaultParticleAmount);
  }

  getParticle(reserver, type = "effect") {
    let emitter = this.emitters[type].find(emitter => emitter.hasFree());

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

  cleanUp() {
    this.emitters.star.forEach(emitter => {
      emitter.cleanUp();
    });

    this.emitters.bolt.forEach(emitter => {
      emitter.cleanUp();
    });

    this.emitters.effect.forEach(emitter => {
      emitter.cleanUp();
    });

    this.emitters = {
      star: [],
      bolt: [],
      effect: []
    };
  }

  release(reserver) {
    this.reservations.forEach(reservation => {
      if (reservation.reserver === reserver) {
        reservation.emitter.freeParticles(reservation.index);
      }
    });
  }

  render(payload) {
    this.emitters.star.forEach(emitter => {
      emitter.render(payload);
    });

    this.emitters.effect.forEach(emitter => {
      emitter.render(payload);
    });

    this.boltInstanceFactory.render(payload);
  }
}

export default ParticleEmitterContainer;
