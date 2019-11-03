import * as THREE from "three";

import { boltVertexShader, boltFragmentShader } from "../../../renderer/shader";
import BoltContainer from "./BoltContainer";
import { loadObject } from "../../../utils/objectLoader";

let loadedCube = null;
let numberCreated = 0;

class BoltInstanceFactory {
  constructor(scene) {
    this.scene = scene;
    this.ready = new Promise(async resolve => {
      if (!loadedCube) {
        loadedCube = await this.loadCube();
      }

      resolve(true);
    });

    const texture = new THREE.TextureLoader().load(
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
        zoomLevel: { type: "f", value: 0.0 }
      },
      transparent: true,
      depthWrite: false,
      //depthTest: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: boltVertexShader,
      fragmentShader: boltFragmentShader,
      wireframe: true
    });

    this.start = Date.now() / 3000;
  }

  render({ total, zoom }) {
    this.material.uniforms.gameTime.value = total;
    this.material.uniforms.zoomLevel.value = 1 / zoom;
    this.mesh.material.needsUpdate = true;
  }

  async create(size = 2000) {
    await this.ready;

    return this.makeInstanced(loadedCube, size);
  }

  async loadCube() {
    if (loadedCube) {
      return loadedCube;
    }

    const cube = await loadObject("/img/3d/effect/bolt/scene.gltf");
    console.log("cube", cube);
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
      quaternionAttribute;

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = original.index;
    geometry.attributes.position = original.attributes.position;
    geometry.attributes.uv = original.attributes.uv;

    console.log("geometry index", original.index);

    const offsets = [];
    const opacitys = [];
    const textureNumbers = [];
    const scales = [];
    const quaternions = [];

    for (let i = 0; i < amount; i++) {
      offsets.push(0, 0, 0.5);
      opacitys.push(0);
      textureNumbers.push(-1);
      scales.push(1, 1, 1);
      quaternions.push(0, 1, 0, 0);
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

    geometry.addAttribute("offset", offsetAttribute);
    geometry.addAttribute("opacity", opacityAttribute);
    geometry.addAttribute("textureNumber", textureNumberAttribute);
    geometry.addAttribute("scale", scaleAttribute);
    geometry.addAttribute("quaternion", quaternionAttribute);

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
      amount,
      mesh,
      this.scene,
      numberCreated
    );
  }
}

export default BoltInstanceFactory;
