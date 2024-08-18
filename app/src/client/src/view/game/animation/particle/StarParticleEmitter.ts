import * as THREE from "three";
import Animation from "../Animation";
import StarParticle from "./StarParticle";
import { starVertexShader, starFragmentShader } from "../../renderer/shader";
import { ParticleEmitterArgs } from "./ParticleEmitter";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

const texture = new THREE.TextureLoader().load(
  "/img/effect/effectTextures1024.png"
);

class StarParticleEmitter extends Animation {
  private scene: THREE.Scene;
  private free: number[];
  private effects: number;
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: THREE.ShaderMaterial;
  private flyParticle: StarParticle;
  private mesh: THREE.Points;
  public needsUpdate: boolean;

  constructor(
    scene: THREE.Scene,
    particleCount: number,
    args: ParticleEmitterArgs = {}
  ) {
    super();

    const blending = args.blending || THREE.AdditiveBlending;

    if (!particleCount) {
      particleCount = 1000;
    }

    this.scene = scene;

    this.free = [];
    for (let i = 0; i < particleCount; i++) {
      this.free.push(i);
    }

    this.effects = 0;

    const uniforms = {
      gameTime: { value: 0.0 },
      texture: { value: texture },
    };

    this.particleGeometry = new THREE.BufferGeometry();

    this.particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    this.particleGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "sizeChange",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    this.particleGeometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "activationGameTime",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "textureNumber",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "angle",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "angleChange",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "parallaxFactor",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "sineFrequency",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );
    this.particleGeometry.setAttribute(
      "sineAmplitude",
      new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1)
    );

    this.particleGeometry.setDrawRange(0, particleCount);

    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      blending: blending,
      depthWrite: false, //Try removing this if problems with transparency
    });

    /*
        THREE.NormalBlending = 0;
        THREE.AdditiveBlending = 1;
        THREE.SubtractiveBlending = 2;
        THREE.MultiplyBlending = 3;
        THREE.AdditiveAlphaBlending = 4;
        */

    this.flyParticle = new StarParticle(
      this.particleMaterial,
      this.particleGeometry
    );

    while (particleCount--) {
      this.flyParticle.create(particleCount).setInitialValues();
    }

    this.mesh = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.mesh.frustumCulled = false;
    //this.mesh.matrixAutoUpdate = false;
    this.mesh.position.set(0, 0, args.z || -10);

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
    ([] as THREE.Material[])
      .concat(this.mesh.material)
      .forEach((material) => material.dispose());
    this.scene.remove(this.mesh);
  }

  render({ total }: RenderPayload) {
    this.particleMaterial.uniforms.gameTime.value = total;
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

    return this.flyParticle.create(i!);
  }

  freeParticles(particleIndices: number | number[]): void {
    particleIndices = ([] as number[]).concat(particleIndices);

    particleIndices.forEach((i) => {
      this.flyParticle.create(i).setInitialValues();
    });
    this.free = this.free.concat(particleIndices);
  }

  update(): void {}
}

export default StarParticleEmitter;
