import * as THREE from "three";
import ShipObjectBoundingBox from "./ShipObjectBoundingBox";
import { ParticleEmitterContainer } from "../../animation/particle";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import SystemSection from "@fieryvoid3/model/src/unit/system/systemSection/SystemSection";
import { SYSTEM_LOCATION } from "@fieryvoid3/model/src/unit/system/systemSection/systemLocation";
import { getSeededRandomGenerator } from "@fieryvoid3/model/src/utils/math";
import {
  PARTICLE_TEXTURE,
  SerializedParticle,
} from "../../animation/particle/BaseParticle";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

type DamageCacheEntry = {
  location: SYSTEM_LOCATION;
  particles: SerializedParticle[];
};

class ShipObjectSectionDamageEffect {
  private ship: Ship;
  private boundingBox: ShipObjectBoundingBox | null = null;
  private particleContainer: ParticleEmitterContainer | null = null;
  private shipZ: number = 0;
  private damageCache: DamageCacheEntry[];
  private animationTime: number;
  private center: IVector | null;
  private scene: THREE.Object3D | null;

  constructor(ship: Ship) {
    this.ship = ship;
    this.damageCache = [];
    this.animationTime = 0;
    this.center = null;
    this.scene = null;
  }

  init(
    boundingBox: ShipObjectBoundingBox,
    particleContainer: ParticleEmitterContainer,
    shipZ: number,
    center: IVector,
    scene: THREE.Object3D
  ) {
    this.boundingBox = boundingBox;
    this.particleContainer = particleContainer;
    this.shipZ = shipZ;
    this.center = center;

    this.particleContainer.setPosition(
      new Vector({
        ...this.center,
        z: this.center.z + this.shipZ,
      })
    );
    this.scene = scene;
  }

  getParticleContainer() {
    if (!this.particleContainer) {
      throw new Error("Particle container not initialized");
    }

    return this.particleContainer;
  }

  getCenter() {
    if (!this.center) {
      throw new Error("Center not initialized");
    }

    return this.center;
  }

  getBoundingBox() {
    if (!this.boundingBox) {
      throw new Error("Bounding box not initialized");
    }

    return this.boundingBox;
  }

  getScene() {
    if (!this.scene) {
      throw new Error("Scene not initialized");
    }

    return this.scene;
  }

  createDamage() {
    this.removeDamage();
    this.ship.systems.sections
      .getSectionsWithStructure()
      .filter((section) => section.getStructure()!.isDestroyed())
      .forEach(this.createDamageForSection.bind(this));
  }

  createDamageForSections(sections: SystemSection[]) {
    this.removeDamage();
    sections.forEach(this.createDamageForSection.bind(this));
  }

  removeDamage() {
    this.damageCache.forEach(({ particles }) =>
      particles.forEach(({ index, emitter }) =>
        emitter.getByIndex(index).setOpacity(0)
      )
    );
  }

  setShipZ(shipZ: number) {
    this.shipZ = shipZ;

    const center = this.getCenter();

    this.getParticleContainer().setPosition(
      new Vector({
        ...center,
        z: center.z + this.shipZ,
      })
    );
  }

  activateFromCache(section: SystemSection) {
    const cached = this.damageCache.find(
      ({ location }) => section.getLocation() === location
    );

    if (!cached) {
      return false;
    }

    cached.particles.forEach(({ index, emitter, opacity }) =>
      emitter.getByIndex(index).setOpacity(opacity)
    );

    return true;
  }

  createDamageForSection(section: SystemSection) {
    if (this.activateFromCache(section)) {
      return;
    }

    const getRandom = getSeededRandomGenerator(
      this.ship.id + section.getLocation()
    );
    const bounds = this.getBoundingBox().getBoundsForSection(section);

    let particles: SerializedParticle[] = [];

    /*
    const dimensionDebugCube = () => {
      const getColor = () => {
        switch (section.getLocation()) {
          case 0:
            return 0x0000ff;
          case 1:
            return 0x00ff00;
          case 2:
            return 0x000000;
          case 31:
            return 0xffff00;
          case 32:
            return 0x00ffff;
          case 41:
            return 0x990000;
          case 42:
            return 0x000099;
        }
      };

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
          color: getColor(),
          wireframe: true,
        })
      );

      const c = bounds.start
        .add(bounds.end)
        .multiplyScalar(0.5)
        .add(this.getCenter());

      cube.scale.set(
        Math.abs(bounds.end.x - bounds.start.x),
        Math.abs(bounds.end.y - bounds.start.y),
        Math.abs(bounds.end.z - bounds.start.z)
      );
      cube.position.set(c.x, c.y, c.z + this.shipZ);
      this.getScene().add(cube);
    };

    dimensionDebugCube();
    */

    const boundSize = new Vector(
      Math.abs(bounds.end.x - bounds.start.x),
      Math.abs(bounds.end.y - bounds.start.y),
      Math.abs(bounds.end.z - bounds.start.z)
    );

    let count =
      Math.ceil((boundSize.x * boundSize.y) / 500) +
      Math.floor(getRandom() * 3);

    while (count--) {
      const offset = new Vector(
        boundSize.x * getRandom(),
        boundSize.y * getRandom(),
        boundSize.z * getRandom()
      );

      const size = getRandom() * 0.5 + 0.5;

      const position = bounds.start.add(offset).setZ(0);

      const random = getRandom();
      particles = [
        ...particles,
        ...createGlow(
          position,
          size,
          this.getParticleContainer(),
          getRandom,
          this
        ),
      ];

      particles = [
        ...particles,
        ...createSmoke(
          position,
          size,
          this.getParticleContainer(),
          getRandom,
          this
        ),
      ];

      if (random < 0.5) {
        let sparkCount = Math.floor(getRandom() * 10) + 5;

        while (sparkCount--) {
          particles = [
            ...particles,
            ...createSpark(
              position,
              this.getParticleContainer(),
              getRandom,
              this
            ),
          ];
        }
      }
    }

    this.damageCache.push({
      location: section.getLocation(),
      particles,
    });
  }

  render(payload: RenderPayload) {
    if (!this.particleContainer || !this.particleContainer.isReady()) {
      return;
    }

    this.animationTime += payload.delta;
    this.getParticleContainer().render({
      ...payload,
      total: this.animationTime,
    });
  }
}

const createSmoke = (
  position: Vector,
  size: number,
  particleContainer: ParticleEmitterContainer,
  getRandom: () => number,
  context: unknown
) => {
  let activation = 0;

  let count = Math.floor(getRandom() * 2) + 2;
  let particles: SerializedParticle[] = [];

  particles = [
    ...particles,
    particleContainer
      .getNormalParticle(context)
      .setSize((getRandom() * 3 + 15) * size)
      .setOpacity(0.8)
      .setColor({ r: 0, g: 0, b: 0 })
      .setPosition(position.toObject())
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setAngle(getRandom() * 360, (getRandom() - 0.5) * 0.01)
      .setActivationTime(activation)
      .serialize(),
  ];

  while (count--) {
    const fadeInSpeed = getRandom() * 1000 + 3000;
    const fadeOutAt = activation + fadeInSpeed;
    const fadeOutSpeed = getRandom() * 1000 + 3000;

    const repeat = fadeOutAt + fadeOutSpeed;

    particles = [
      ...particles,
      particleContainer
        .getNormalParticle(context)
        .setSize((getRandom() * 10 + 5) * size)
        .setSizeChange(getRandom() * 0.002 + 0.002)
        .setOpacity(1)
        .setFadeIn(activation, fadeInSpeed)
        .setFadeOut(fadeOutAt, fadeOutSpeed)
        .setColor(getSmokeColor())
        .setPosition(position.toObject())
        .setTexture(PARTICLE_TEXTURE.GAS)
        .setAngle(getRandom() * 360, (getRandom() - 0.5) * 0.001 + 0.001)
        .setActivationTime(activation)
        .setRepeat(repeat)
        .serialize(),
    ];

    activation += getRandom() * 1000;
  }

  return particles;
};

const createGlow = (
  position: Vector,
  size: number,
  particleContainer: ParticleEmitterContainer,
  getRandom: () => number,
  context: unknown
) => {
  let activation = 0;

  let count = Math.floor(getRandom() * 2) + 2;
  let particles: SerializedParticle[] = [];

  particles = [
    ...particles,
    particleContainer
      .getNormalParticle(context)
      .setSize((getRandom() * 5 + 10) * size)
      .setOpacity(0.6)
      .setColor(getYellowRandomColor())
      .setPosition(position.toObject())
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(activation)
      .serialize(),
  ];

  particles = [
    ...particles,
    particleContainer
      .getNormalParticle(context)
      .setSize((getRandom() * 3 + 4) * size)
      .setOpacity(0.6)
      .setColor({ r: 1, g: 1, b: 1 })
      .setPosition(position.toObject())
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(activation)
      .serialize(),
  ];

  while (count--) {
    const fadeInSpeed = getRandom() * 500;
    const fadeOutAt = activation + fadeInSpeed;
    const fadeOutSpeed = getRandom() * 1000 + 500;

    const repeat = fadeOutAt + fadeOutSpeed;

    const modPosition = position.add(
      new Vector(getRandom() - 0.5, getRandom() - 0.5, getRandom() - 0.5)
        .normalize()
        .multiplyScalar(getRandom() * 2 * size)
    );

    particles = [
      ...particles,
      particleContainer
        .getNormalParticle(context)
        .setSize((getRandom() * 10 + 5) * size)
        .setSizeChange(-0.002)
        .setOpacity(0.3)
        .setFadeIn(activation, fadeInSpeed)
        .setFadeOut(fadeOutAt, fadeOutSpeed)
        .setColor(getYellowRandomColor())
        .setPosition(modPosition.toObject())
        .setTexture(PARTICLE_TEXTURE.GLOW)
        .setAngle(getRandom() * 360, (getRandom() - 0.5) * 0.1)
        .setActivationTime(activation)
        .setRepeat(repeat)
        .serialize(),
    ];

    activation += getRandom() * 1000;
  }

  return particles;
};

const createSpark = (
  position: Vector,
  particleContainer: ParticleEmitterContainer,
  getRandom: () => number,
  context: unknown
) => {
  const activation = 0;
  const fadeInSpeed = 100;
  const fadeOutAt = activation + fadeInSpeed;
  const fadeOutSpeed = getRandom() * 1000 + 500;
  let particles: SerializedParticle[] = [];

  const velocity = new Vector(
    getRandom() - 0.5,
    getRandom() - 0.5,
    getRandom() - 0.5
  )
    .normalize()
    .multiplyScalar(0.005 + getRandom() * 0.005);

  const repeat = fadeOutAt + fadeOutSpeed;

  particles = [
    ...particles,
    particleContainer
      .getNormalParticle(context)
      .setSize(2)
      .setSizeChange(-0.002)
      .setOpacity(0.6)
      .setFadeIn(activation, fadeInSpeed)
      .setFadeOut(fadeOutAt, fadeOutSpeed)
      .setColor(getYellowRandomColor())
      .setPosition(position.toObject())
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(activation)
      .setRepeat(repeat)
      .setVelocity(velocity)
      .serialize(),
  ];

  particles = [
    ...particles,
    particleContainer
      .getNormalParticle(context)
      .setSize(1)
      .setSizeChange(-0.005)
      .setOpacity(1)
      .setFadeIn(activation, fadeInSpeed)
      .setFadeOut(fadeOutAt, fadeOutSpeed)
      .setColor({ r: 1, g: 1, b: 1 })
      .setPosition(position.toObject())
      .setTexture(PARTICLE_TEXTURE.GLOW)
      .setActivationTime(activation)
      .setRepeat(repeat)
      .setVelocity(velocity)
      .serialize(),
  ];

  return particles;
};

const getYellowRandomColor = () => {
  return new THREE.Color().setRGB(
    1,
    (155 - Math.floor(Math.random() * 75)) / 255,
    Math.floor(Math.random() * 20) / 255
  );
};

const getSmokeColor = () => {
  const c = (Math.random() * 50 + 20) / 255;
  return new THREE.Color().setRGB(c, c, c + 0.05);
};

export default ShipObjectSectionDamageEffect;
