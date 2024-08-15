import * as THREE from "three";

import { boltVertexShader, boltFragmentShader } from "../../../renderer/shader";
import BoltContainer from "./BoltContainer";
import { loadObject } from "../../../utils/objectLoader";

let loadedCube = null;
let numberCreated = 0;

class BoltInstanceFactory {
  constructor(scene) {
    this.scene = scene;
    this.ready = new Promise(async (resolve) => {
      if (!loadedCube) {
        loadedCube = await this.loadCube();
      }

      resolve(true);
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
        gameTime: { type: "f", value: 0.0 },
        zoomLevel: { type: "f", value: 0.0 },
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

  render({ total, zoom }) {
    this.material.uniforms.gameTime.value = total;
    this.material.uniforms.zoomLevel.value = 1 / zoom;
    this.material.needsUpdate = true;
  }

  create(size = 2000) {
    return this.makeInstanced(loadedCube, size);
  }

  async loadCube() {
    if (loadedCube) {
      return loadedCube;
    }

    const cube = await loadObject("/img/3d/effect/bolt/scene.gltf");
    const cubeGeometry = cube.scene.children[0].geometry;
    //cubeGeometry.rotateY((90 * Math.PI) / 180);
    //cubeGeometry.scale(0.5, 0.5, 0.5);

    loadedCube = cubeGeometry;
    return loadedCube;
  }

  makeInstanced(original, amount) {
    original = original.clone();

    let offsetAttribute,
      opacityAttribute,
      textureNumberAttribute,
      scaleAttribute,
      quaternionAttribute,
      colorAttribute,
      velocityAttribute,
      activationGameTimeAttribute,
      deactivationGameTimeAttribute,
      deactivationFadeAttribute,
      repeatAttribute;

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

    offsetAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(offsets),
      3
    ).setDynamic(true);

    opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(opacitys),
      1
    ).setDynamic(true);

    textureNumberAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(textureNumbers),
      1
    ).setDynamic(true);

    scaleAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(scales),
      3
    ).setDynamic(true);

    quaternionAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(quaternions),
      4
    ).setDynamic(true);

    colorAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(colors),
      3
    ).setDynamic(true);

    velocityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(velocitys),
      3
    ).setDynamic(true);

    activationGameTimeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(activations),
      1
    ).setDynamic(true);

    deactivationGameTimeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(deactivations),
      1
    ).setDynamic(true);

    deactivationFadeAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(fades),
      1
    ).setDynamic(true);

    repeatAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(repeats),
      1
    ).setDynamic(true);

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
