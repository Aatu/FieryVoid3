import * as THREE from "three";

import { boltVertexShader, boltFragmentShader } from "../../../renderer/shader";

import {
  getPromise,
  ReadyPromise,
} from "@fieryvoid3/model/src/utils/ReadyPromise";
import { RenderPayload } from "../../../phase/phaseStrategy/PhaseStrategy";
import { loadObject } from "../../../utils/objectLoader";
import BoltContainer from "./BoltContainer";

let loadedCube: null | THREE.BufferGeometry = null;
let numberCreated = 0;

class BoltInstanceFactory {
  private scene: THREE.Scene;
  private ready: ReadyPromise<boolean>;
  private material: THREE.RawShaderMaterial;
  private start: number;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.ready = getPromise<boolean>(async () => {
      if (!loadedCube) {
        loadedCube = await this.loadCube();
      }

      return true;
    });

    const texture = new THREE.TextureLoader().load(
      //"/img/offline.png"
      "/img/effect/effectTextures1024.png"
    );

    //texture.minFilter = THREE.LinearMipMapNearestFilter;

    /*
    THREE.NearestFilter
THREE.NearestMipMapNearestFilter
THREE.NearestMipMapLinearFilter
THREE.LinearFilter
THREE.LinearMipMapNearestFilter
THREE.LinearMipMapLinearFilter
*/

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        map: { value: texture },
        gameTime: { value: 0 },
        zoomLevel: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: boltVertexShader,
      fragmentShader: boltFragmentShader,
      //wireframe: true
    });

    this.start = Date.now() / 3000;
  }

  isReady(): boolean {
    return this.ready.ready;
  }

  getReady(): Promise<boolean> {
    return this.ready.promise;
  }

  render({ total, zoom }: RenderPayload) {
    this.material.uniforms.gameTime.value = total;
    this.material.uniforms.zoomLevel.value = 1 / zoom;
    this.material.needsUpdate = true;
  }

  create(size = 2000) {
    if (!this.isReady()) {
      throw new Error("BoltInstanceFactory is not ready");
    }

    return this.makeInstanced(loadedCube!, size);
  }

  async loadCube() {
    if (loadedCube) {
      return loadedCube;
    }

    const cube = await loadObject("/img/3d/effect/bolt/scene.gltf");

    //TODO: Check that GLTF is imported properly
    const cubeGeometry = (cube.object.children[0] as THREE.Mesh).geometry;
    //cubeGeometry.rotateY((90 * Math.PI) / 180);
    //cubeGeometry.scale(0.5, 0.5, 0.5);

    loadedCube = cubeGeometry;
    return loadedCube;
  }

  makeInstanced(original: THREE.BufferGeometry, amount: number) {
    original = original.clone();

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = original.index;
    geometry.attributes.position = original.attributes.position;
    geometry.attributes.uv = original.attributes.uv;

    const offsets = [];
    const opacitys = [];
    const textureNumbers = [];
    const scales = [];
    const quaternions = [];
    const colors = [];
    const velocitys = [];
    const activations = [];
    const deactivations = [];
    const fades = [];
    const repeats = [];

    for (let i = 0; i < amount; i++) {
      offsets.push(0, 0, 0.5);
      opacitys.push(0);
      textureNumbers.push(-1);
      scales.push(1, 1, 1);
      quaternions.push(0, 1, 0, 0);
      colors.push(0, 0, 0);
      velocitys.push(0, 0, 0);
      activations.push(0);
      deactivations.push(0);
      fades.push(0);
      repeats.push(0);
    }

    const offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    );

    const opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(opacitys),
      1
    );

    const textureNumberAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      1
    );

    const scaleAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(scales),
      3
    );

    const quaternionAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(quaternions),
      4
    );

    const colorAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(colors),
      3
    );

    const velocityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(velocitys),
      3
    );

    const activationGameTimeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(activations),
      1
    );

    const deactivationGameTimeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(deactivations),
      1
    );

    const deactivationFadeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(fades),
      1
    );

    const repeatAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(repeats),
      1
    );

    geometry.setAttribute("offset", offsetAttribute);
    geometry.setAttribute("opacity", opacityAttribute);
    geometry.setAttribute("textureNumber", textureNumberAttribute);
    geometry.setAttribute("scale", scaleAttribute);
    geometry.setAttribute("quaternion", quaternionAttribute);
    geometry.setAttribute("color", colorAttribute);
    geometry.setAttribute("velocity", velocityAttribute);
    geometry.setAttribute("activationGameTime", activationGameTimeAttribute);
    geometry.setAttribute(
      "deactivationGameTime",
      deactivationGameTimeAttribute
    );
    geometry.setAttribute("deactivationFade", deactivationFadeAttribute);
    geometry.setAttribute("repeat", repeatAttribute);

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.frustumCulled = false;

    this.scene.add(mesh);

    numberCreated++;

    return new BoltContainer(
      offsetAttribute,
      opacityAttribute,
      textureNumberAttribute,
      scaleAttribute,
      quaternionAttribute,
      colorAttribute,
      velocityAttribute,
      activationGameTimeAttribute,
      deactivationGameTimeAttribute,
      deactivationFadeAttribute,
      repeatAttribute,
      amount,
      mesh,
      this.scene,
      numberCreated
    );
  }
}

export default BoltInstanceFactory;
