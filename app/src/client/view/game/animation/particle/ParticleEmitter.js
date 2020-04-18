import * as THREE from "three";
import Animation from "../Animation";
import BaseParticle from "./BaseParticle";
import {
  effectVertexShader,
  effectFragmentShader,
} from "../../renderer/shader";

const texture = new THREE.TextureLoader().load(
  "/img/effect/effectTextures1024.png"
);

class ParticleEmitter extends Animation {
  constructor(scene, particleCount, args = {}) {
    super();

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
      zoomLevel: { type: "f", value: 1.0 },
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
      "fadeInTime",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "fadeInSpeed",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "fadeOutTime",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "fadeOutSpeed",
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
      "velocity",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount * 3),
        3
      ).setDynamic(true)
    );
    this.particleGeometry.setAttribute(
      "acceleration",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount * 3),
        3
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
      "sine",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );

    this.particleGeometry.setAttribute(
      "repeat",
      new THREE.Float32BufferAttribute(
        new Float32Array(particleCount),
        1
      ).setDynamic(true)
    );

    this.particleGeometry.dynamic = true;

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

  setPosition({ x, y, z }) {
    this.mesh.position.set(x, y, z);
    this.needsUpdate = true;
  }

  cleanUp() {
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }

  render({ total, zoom }) {
    this.particleMaterial.uniforms.gameTime.value = total;
    this.particleMaterial.uniforms.zoomLevel.value = 1 / zoom;
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

    return this.flyParticle.create(i, this);
  }

  getByIndex(index) {
    return this.flyParticle.aquire(index, this);
  }

  freeParticles(particleIndices) {
    particleIndices = [].concat(particleIndices);

    particleIndices.forEach(function (i) {
      this.flyParticle.create(i).setInitialValues();
    }, this);
    this.free = this.free.concat(particleIndices);
  }
}

export default ParticleEmitter;
