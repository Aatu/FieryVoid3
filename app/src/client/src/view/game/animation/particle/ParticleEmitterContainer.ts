import Vector from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";
import {
  getPromise,
  ReadyPromise,
} from "@fieryvoid3/model/src/utils/ReadyPromise";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import BoltInstanceFactory from "./BoltParticleEmitter/BoltInstanceFactory";
import ParticleEmitter from "./ParticleEmitter";
import StarParticleEmitter from "./StarParticleEmitter";
import BoltContainer from "./BoltParticleEmitter/BoltContainer";
import BoltInstance from "./BoltParticleEmitter/BoltInstance";
import StarParticle from "./StarParticle";
import BaseParticle from "./BaseParticle";

type Emitter = StarParticleEmitter | ParticleEmitter | BoltContainer;

enum ParticleEmitterType {
  STAR = "star",
  BOLT = "bolt",
  EFFECT = "effect",
  NORMAL = "normal",
}

class ParticleEmitterContainer {
  private scene: THREE.Object3D;
  private defaultParticleAmount: number;
  private boltInstanceFactory: BoltInstanceFactory;
  private reservations: {
    reserver: unknown;
    emitter: Emitter;
    index: number;
  }[];
  private emitters: {
    star: StarParticleEmitter[];
    bolt: ParticleEmitter[];
    effect: ParticleEmitter[];
    normal: ParticleEmitter[];
  };

  private readyPromise: ReadyPromise<boolean>;
  private position: Vector;

  constructor(scene: THREE.Object3D, defaultParticleAmount: number) {
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

    this.readyPromise = getPromise<boolean>(async () => {
      await this.boltInstanceFactory.getReady();

      return true;
    });

    this.position = new Vector();
  }

  isReady() {
    return this.readyPromise.ready;
  }

  getReady(): Promise<boolean> {
    return this.readyPromise.promise;
  }

  createParticleEmitter(type: ParticleEmitterType): Emitter {
    switch (type) {
      case ParticleEmitterType.STAR:
        return this.createStarParticleEmitter();
      case ParticleEmitterType.BOLT:
        return this.createBoltParticleEmitter();
      case ParticleEmitterType.NORMAL:
        return this.createNormalParticleEmitter();
      case ParticleEmitterType.EFFECT:
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

  private getParticle(
    reserver: unknown,
    type: ParticleEmitterType = ParticleEmitterType.EFFECT
  ) {
    let emitter: Emitter | undefined = this.emitters[type].find((emitter) =>
      emitter.hasFree()
    );

    if (!emitter) {
      emitter = this.createParticleEmitter(type);
      (this.emitters[type] as (typeof emitter)[]).push(emitter);
    }

    const particle = emitter.getParticle();

    if (!particle) {
      throw new Error("No free particles available");
    }

    this.reservations.push({ reserver, emitter, index: particle.getIndex() });

    return particle;
  }

  getStarParticle(reserver: unknown): StarParticle {
    return this.getParticle(reserver, ParticleEmitterType.STAR) as StarParticle;
  }

  getBoltParticle(reserver: unknown): BoltInstance {
    return this.getParticle(reserver, ParticleEmitterType.BOLT) as BoltInstance;
  }

  getEffectParticle(reserver: unknown): BaseParticle {
    return this.getParticle(
      reserver,
      ParticleEmitterType.EFFECT
    ) as BaseParticle;
  }

  getNormalParticle(reserver: unknown): BaseParticle {
    return this.getParticle(
      reserver,
      ParticleEmitterType.NORMAL
    ) as BaseParticle;
  }

  setPosition(position: Vector) {
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

  release(reserver: unknown) {
    this.reservations.forEach((reservation) => {
      if (reservation.reserver === reserver) {
        reservation.emitter.freeParticles(reservation.index);
      }
    });
  }

  render(payload: RenderPayload) {
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
