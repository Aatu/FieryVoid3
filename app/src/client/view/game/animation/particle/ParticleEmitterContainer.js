import Animation from "../Animation";
import ParticleEmitter from "./ParticleEmitter";
import { StarParticleEmitter } from ".";
import BoltInstanceFactory from "./BoltParticleEmitter/BoltInstanceFactory";

class ParticleEmitterContainer extends Animation {
  constructor(scene, defaultParticleAmount) {
    super();
    this.scene = scene;
    this.defaultParticleAmount = defaultParticleAmount;
    this.emitterClass = emitterClass || ParticleEmitter;
    this.emitterArgs = emitterArgs || {};

    this.boltInstanceFactory = new BoltInstanceFactory(this.scene);

    this.reservations = [];

    this.emitters = {
      star: [],
      bolt: [],
      effect: []
    };
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

  getStarParticle(reserver) {
    let emitter = this.emitters.star.find(emitter => emitter.hasFree());

    if (!emitter) {
      this.emitters.star.push(this.createStarParticleEmitter());
    }

    const particle = emitter.getParticle();

    this.reservations.push({ reserver, emitter, index: particle.index });

    return particle;
  }

  cleanUp() {
    this.emitters.star.forEach(emitter => {
      emitter.emitter.cleanUp();
    });

    this.emitters.bolt.forEach(emitter => {
      emitter.emitter.cleanUp();
    });

    this.emitters.effect.forEach(emitter => {
      emitter.emitter.cleanUp();
    });

    this.emitters = {
      star: [],
      bolt: [],
      effect: []
    };
  }

  cleanupReserver(reserver) {
    this.reservations.forEach(reservation => {
      if (reservation.reserver === reserver) {
        reservation.emitter.freeParticles(reservation.index);
      }
    });
  }

  /*
    ParticleEmitterContainer.prototype.cleanUpAnimation = function (animation) {
        this.emitters.forEach(function (emitter) {
           cleanUpAnimationFromEmitter(animation, emitter);
        });
    };
    */

  /*
  setRotation(rotation) {
    this.emitters.forEach(function(emitter) {
      emitter.emitter.mesh.rotation.y = (rotation * Math.PI) / 180;
    });
  }

  setPosition(pos) {
    this.emitters.forEach(function(emitter) {
      emitter.emitter.mesh.position.x = pos.x;
      emitter.emitter.mesh.position.y = pos.y;
      emitter.emitter.mesh.position.z = pos.z;
    });
  }

  lookAt(thing) {
    this.emitters.forEach(function(emitter) {
      emitter.emitter.mesh.quaternion.copy(thing.quaternion);
    });
  }

  */

  render(payload) {
    this.emitters.forEach(emitter => {
      emitter.emitter.render(payload);
    });

    this.emitters.star.forEach(emitter => {
      emitter.emitter.render(payload);
    });

    this.emitters.bolt.forEach(emitter => {
      emitter.emitter.render(payload);
    });

    this.emitters.effect.forEach(emitter => {
      emitter.emitter.render(payload);
    });
  }

  /*
    function cleanUpAnimationFromEmitter(animation, emitter) {
        var reservation = getReservation(emitter.reservations);
         emitter.reservations = emitter.reservations.filter(function (res) {
            return res !== reservation;
        });
         emitter.emitter.freeParticles(reservation.indexes);
    }
  getReservation(reservations, animation, create) {
    var reservation = reservations.find(function(reservation) {
      return reservation.animation === animation;
    });

    if (!reservation && create) {
      reservation = { animation: animation, indexes: [] };
      reservations.push(reservation);
    }

    return reservation;
  }
  
    */
}

export default ParticleEmitterContainer;
