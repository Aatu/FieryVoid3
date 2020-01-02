import * as THREE from "three";

import { line2dVertexShader, line2dFragmentShader } from "../shader";
import { loadObject } from "../../utils/objectLoader";
import Vector from "../../../../../model/utils/Vector.mjs";

const GEOMETRY = loadObject("/img/3d/line3/scene.gltf");

const getTexture = (type = "") => {
  switch (type) {
    case "dashed":
      return new THREE.TextureLoader().load("/img/line/dash.png");
    case "dashed-arrow":
      return new THREE.TextureLoader().load("/img/line/dashArrow.png");
    case "dashed-circle":
      return new THREE.TextureLoader().load("/img/line/dashCircle.png");
    default:
      return new THREE.TextureLoader().load("/img/line/full.png");
  }
};

class LineSprite {
  constructor(start, end, lineWidth, args = {}) {
    this.args = args;
    this.mesh = null;

    this.color = args.color || new THREE.Color(1, 1, 1);
    this.opacity = args.opacity || 1;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        map: {
          value: getTexture(args.type)
        },
        time: { type: "f", value: 0.0 },
        zoom: { type: "f", value: 0.0 },
        color: { type: "v3", value: this.color },
        opacity: { type: "f", value: this.opacity },
        textureRepeat: { type: "f", value: 1.0 },
        pulse: {
          type: "v2",
          value: [args.pulseAmount || 0, args.pulseSpeed || 1]
        }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: args.blending || THREE.NormalBlending,
      vertexShader: line2dVertexShader,
      fragmentShader: line2dFragmentShader
      //wireframe: true
    });

    this.start = start;
    this.end = end;
    this.lineWidth = lineWidth;

    this.create();
    this.update(start, end, lineWidth, true);
    this.animate();
  }

  animate() {
    const now = Date.now();
    this.material.uniforms.time.value = (now % 1000) * 0.001;
    this.material.needsUpdate = true;
    requestAnimationFrame(this.animate.bind(this));
  }

  async addTo(scene) {
    this.scene = scene;
    await GEOMETRY;
    scene.add(this.mesh);
  }

  async create() {
    this.material.uniforms.map.value.wrapT = THREE.RepeatWrapping;
    this.material.uniforms.map.value.minFilter =
      this.args.minFilter || THREE.LinearMipmapNearestFilter;

    this.material.needsUpdate = true;

    const geometry = await GEOMETRY;
    this.mesh = new THREE.Mesh(
      geometry.scene.children[0].geometry.clone(),
      this.material
    );
  }

  async updateTextureSize(size) {
    this.args.textureSize = size;
    const distance = this.start.distanceTo(this.end);
    let textureRepeat = this.args.textureSize
      ? distance / this.args.textureSize
      : 1;

    if (this.args.roundTestureRepeate) {
      textureRepeat = Math.round(textureRepeat);
    }

    this.material.uniforms.textureRepeat.value = textureRepeat;
  }

  async update(start, end, lineWidth = 1, force) {
    await GEOMETRY;

    if (lineWidth !== this.lineWidth || force) {
      this.mesh.scale.setY(this.lineWidth);
    }

    if (!start.equals(this.start) || !end.equals(this.end) || force) {
      const direction = end.sub(start);

      this.mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(1, 0, 0).normalize(),
        direction.normalize()
      );

      const distance = start.distanceTo(end);
      this.mesh.scale.setX(distance);
      const position = start.add(direction.multiplyScalar(0.5));
      this.mesh.position.set(position.x, position.y, position.z);
      let testureRepeat = this.args.textureSize
        ? distance / this.args.textureSize
        : 1;

      if (this.args.roundTestureRepeate) {
        testureRepeat = Math.round(testureRepeat);
      }
      this.material.uniforms.textureRepeat.value = testureRepeat;
      this.material.needsUpdate = true;
    }

    this.start = start;
    this.end = end;
    this.lineWidth = lineWidth;

    return this;
  }

  render(zoom) {
    /*
    if (zoom > 1) {
      this.material.uniforms.opacity.value =
        this.opacity * (1 + (zoom - 1) * 0.5);
    }
    */
    //this.mesh.scale.setY(this.lineWidth * (zoom * 0.5));
    /*
    const distance = this.start.distanceTo(this.end) / zoom;

    this.material.uniforms.textureRepeat.value = this.args.textureSize
      ? distance / this.args.textureSize
      : 1;
      */
  }

  async hide() {
    await GEOMETRY;
    this.mesh.visible = false;
    return this;
  }

  async show() {
    await GEOMETRY;
    this.mesh.visible = true;
    return this;
  }

  async destroy() {
    await GEOMETRY;
    this.scene.remove(this.mesh);
    this.mesh.material.dispose();
  }
}

export default LineSprite;
