import * as THREE from "three";
import Animation from "../Animation";
import StarParticle from "./StarParticle";
import { starVertexShader, starFragmentShader } from "../../renderer/shader";

const texture = new THREE.TextureLoader().load(
  "/img/effect/effectTextures1024.png"
);

class StarParticleEmitter extends Animation {
  constructor(scene, particleCount, args) {
    super();

    if (!args) {
      args = {};
    }

    var blending = args.blending || THREE.AdditiveBlending;

    if (!particleCount) {
      particleCount = 1000;
    }

    this.scene = scene;

    this.free = [];
    for (var i = 0; i < particleCount; i++) {
      this.free.push(i);
    }

    this.effects = 0;

    var uniforms = {
      gameTime: { type: "f", value: 0.0 },
      texture: { type: "t", value: texture },
    };

    this.particleGeometry = new THREE.BufferGeometry();

    this.particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount * 3),
        3
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "sizeChange",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount * 3),
        3
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "activationGameTime",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "textureNumber",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "angle",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "angleChange",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "parallaxFactor",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "sineFrequency",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "sineAmplitude",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );

    this.particleGeometry.dynamic = true;

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

  setPosition({ x, y, z }) {
    this.mesh.position.set(x, y, z);
    this.needsUpdate = true;
  }

  cleanUp() {
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }

  render({ total }) {
    this.particleMaterial.uniforms.gameTime.value = total;
    this.mesh.material.needsUpdate = true;
  }

  hasFree() {
    return this.free.length > 0;
  }

  getParticle() {
    if (this.free.length === 0) {
      return false;
    }

    var i = this.free.pop();

    return this.flyParticle.create(i);
  }

  freeParticles(particleIndices) {
    particleIndices = [].concat(particleIndices);

    particleIndices.forEach(function (i) {
      this.flyParticle.create(i).setInitialValues();
    }, this);
    this.free = this.free.concat(particleIndices);
  }
}

export default StarParticleEmitter;
