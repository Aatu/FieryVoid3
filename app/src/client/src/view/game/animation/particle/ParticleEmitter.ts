import * as THREE from "three";
import Animation from "../Animation";
import BaseParticle from "./BaseParticle";
import {
  effectVertexShader,
  effectFragmentShader,
} from "../../renderer/shader";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

const texture = new THREE.TextureLoader().load(
  "/img/effect/effectTextures1024.png"
);

export type ParticleEmitterArgs = {
  blending?: THREE.Blending;
  z?: number;
};

class ParticleEmitter extends Animation {
  protected scene: THREE.Object3D;
  protected free: number[];
  protected effects: number;
  protected particleGeometry: THREE.BufferGeometry;
  protected particleMaterial: THREE.ShaderMaterial;
  protected flyParticle: BaseParticle;
  protected mesh: THREE.Points;
  protected needsUpdate: boolean;
  protected particleCount: number;

  constructor(
    scene: THREE.Object3D,
    particleCount: number,
    args: ParticleEmitterArgs = {}
  ) {
    super();

    const blending = args.blending || THREE.AdditiveBlending;

    if (!particleCount) {
      particleCount = 1000;
    }

    this.particleCount = particleCount;

    this.scene = scene;

    this.free = [];
    for (let i = 0; i < particleCount; i++) {
      this.free.push(i);
    }

    this.effects = 0;

    const uniforms = {
      gameTime: { value: 0.0 },
      zoomLevel: { value: 1.0 },
      uTexture: { value: texture },
    };

    this.particleGeometry = new THREE.BufferGeometry();

    this.particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "sizeChange",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3) //.setDynamic(true)
    );
    /*
    this.particleGeometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    */
    this.particleGeometry.setAttribute(
      "fadeInTime",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    /*
    this.particleGeometry.setAttribute(
      "fadeInSpeed",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    */
    this.particleGeometry.setAttribute(
      "fadeOutTime",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    /*
    this.particleGeometry.setAttribute(
      "fadeOutSpeed",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    */
    this.particleGeometry.setAttribute(
      "activationGameTime",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "velocity",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "acceleration",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "textureNumber",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "angle",
      new THREE.Uint32BufferAttribute(new Uint32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "sine",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "repeat",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1) //.setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "opacityAndFadeSpeeds",
      new THREE.Uint32BufferAttribute(new Uint32Array(particleCount), 1) //.setDynamic(true)
    );

    //this.particleGeometry.dynamic = true;

    this.particleGeometry.setDrawRange(0, particleCount);

    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: effectVertexShader,
      fragmentShader: effectFragmentShader,
      transparent: true,
      blending: blending,
      depthWrite: false,
      depthTest: false,
    });

    /*
        THREE.NormalBlending = 0;
        THREE.AdditiveBlending = 1;
        THREE.SubtractiveBlending = 2;
        THREE.MultiplyBlending = 3;
        THREE.AdditiveAlphaBlending = 4;
        */

    this.flyParticle = new BaseParticle(
      this.particleMaterial,
      this.particleGeometry
    );

    while (particleCount--) {
      this.flyParticle.create(particleCount).setInitialValues();
    }

    this.mesh = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.mesh.position.set(0, 0, 0);
    this.mesh.frustumCulled = false;
    this.needsUpdate = false;

    this.scene.add(this.mesh);
  }

  setPosition({ x, y, z }: IVector) {
    this.mesh.position.set(x, y, z);
    this.needsUpdate = true;
  }

  setParentPosition(p: IVector) {
    this.setPosition(p);
  }

  cleanUp() {
    ([] as THREE.Material[]).concat(this.mesh.material).forEach((material) => {
      material.dispose();
    });

    this.scene.remove(this.mesh);
  }

  update() {}

  render({ total, zoom }: RenderPayload) {
    this.particleMaterial.uniforms.gameTime.value = total;
    this.particleMaterial.uniforms.zoomLevel.value = 1 / zoom;
    //this.mesh.material.needsUpdate = true;
  }

  hasFree() {
    return this.free.length > 0;
  }

  getParticle() {
    if (this.free.length === 0) {
      return false;
    }

    const i = this.free.pop();

    return this.flyParticle.create(i!, this);
  }

  forceGetParticle() {
    const p = this.getParticle();
    if (!p) {
      throw new Error("No free particles");
    }

    return p;
  }

  getByIndex(index: number) {
    return this.flyParticle.aquire(index, this);
  }

  freeAllParticles() {
    this.free = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.flyParticle.create(i);
      this.free.push(i);
    }
  }

  freeParticles(particleIndices: number | number[]) {
    particleIndices = ([] as number[]).concat(particleIndices);

    particleIndices.forEach((i) => {
      this.flyParticle.create(i);
    });
    this.free = this.free.concat(particleIndices);
  }

  getMesh() {
    return this.mesh;
  }
}

export default ParticleEmitter;
