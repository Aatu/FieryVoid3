import * as THREE from "three";

import { line2dVertexShader, line2dFragmentShader } from "../shader";
import { loadObject } from "../../utils/objectLoader";
import Vector from "@fieryvoid3/model/src/utils/Vector";

const GEOMETRY = loadObject("/img/3d/line3/scene.gltf");

const textureLoader = new THREE.TextureLoader();
const TEXTURE_DASHED = textureLoader.load("/img/line/dash.png");
const TEXTURE_DASHED_ARROW = textureLoader.load("/img/line/dashArrow.png");
const TEXTURE_DASHED_CIRCLE = textureLoader.load("/img/line/dashCircle.png");
const TEXTURE_DASHED_FULL = textureLoader.load("/img/line/full.png");

const getTexture = (type: LineType = LineType.DASHED_FULL) => {
  switch (type) {
    case LineType.DASHED:
      return TEXTURE_DASHED;
    case LineType.DASHED_ARROW:
      return TEXTURE_DASHED_ARROW;
    case LineType.DASHED_CIRCLE:
      return TEXTURE_DASHED_CIRCLE;
    default:
      return TEXTURE_DASHED_FULL;
  }
};

export enum LineType {
  DASHED = "dashed",
  DASHED_ARROW = "dashed-arrow",
  DASHED_CIRCLE = "dashed-circle",
  DASHED_FULL = "dashed-full",
}

type LineSpriteArgs = {
  type?: LineType;
  color?: THREE.Color;
  opacity?: number;
  pulseAmount?: number;
  pulseSpeed?: number;
  blending?: THREE.Blending;
  minFilter?: THREE.TextureFilter;
  textureSize?: number;
  roundTestureRepeate?: boolean;
};

class LineSprite {
  private args: LineSpriteArgs;
  private mesh: THREE.Mesh | null = null;
  private color: THREE.Color;
  private opacity: number;
  private material: THREE.RawShaderMaterial;
  private start: Vector;
  private end: Vector;
  private lineWidth: number;
  private scene: THREE.Object3D | null = null;

  constructor(
    start: Vector,
    end: Vector,
    lineWidth: number,
    args: LineSpriteArgs = {}
  ) {
    this.args = args;
    this.mesh = null;

    this.color = args.color || new THREE.Color(1, 1, 1);
    this.opacity = args.opacity || 1;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        map: {
          value: getTexture(args.type),
        },
        time: { value: 0.0 },
        zoom: { value: 0.0 },
        color: { value: this.color },
        opacity: { value: this.opacity },
        textureRepeat: { value: 1.0 },
        pulse: {
          value: [args.pulseAmount || 0, args.pulseSpeed || 1],
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: args.blending || THREE.NormalBlending,
      vertexShader: line2dVertexShader,
      fragmentShader: line2dFragmentShader,
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

  getMesh() {
    if (!this.mesh) {
      throw new Error("Mesh not created");
    }

    return this.mesh;
  }

  async addTo(scene: THREE.Object3D) {
    this.scene = scene;
    await GEOMETRY;
    scene.add(this.getMesh());
  }

  async create() {
    this.material.uniforms.map.value.wrapT = THREE.RepeatWrapping;
    this.material.uniforms.map.value.minFilter =
      this.args.minFilter || THREE.LinearMipmapNearestFilter;

    this.material.needsUpdate = true;

    const geometry = await GEOMETRY;

    this.mesh = new THREE.Mesh(
      (geometry.object.children[0] as THREE.Mesh).geometry,
      this.material
    );
  }

  async updateTextureSize(size: number) {
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

  async update(
    start: Vector,
    end: Vector,
    lineWidth: number = 1,
    force: boolean = false
  ) {
    await GEOMETRY;

    if (lineWidth !== this.lineWidth || force) {
      this.getMesh().scale.setY(this.lineWidth);
    }

    if (!start.equals(this.start) || !end.equals(this.end) || force) {
      const direction = end.sub(start);

      this.getMesh().quaternion.setFromUnitVectors(
        new THREE.Vector3(1, 0, 0).normalize(),
        direction.normalize()
      );

      const distance = start.distanceTo(end);
      this.getMesh().scale.setX(distance);
      const position = start.add(direction.multiplyScalar(0.5));
      this.getMesh().position.set(position.x, position.y, position.z);
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

  render() {
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
    this.getMesh().visible = false;
    return this;
  }

  async show() {
    await GEOMETRY;
    this.getMesh().visible = true;
    return this;
  }

  async destroy() {
    await GEOMETRY;

    this.scene!.remove(this.getMesh());

    //this.getMesh().material.dispose();
    this.getMesh().geometry.dispose();
  }
}

export default LineSprite;
