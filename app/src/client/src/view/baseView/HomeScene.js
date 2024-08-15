import * as THREE from "three";
import StarField from "../game/terrain/StarField";

window.THREE = THREE;

class HomeScene {
  constructor() {
    this.starFieldScene = null;
    this.starFieldCamera = null;
    this.starField = null;
    this.width = null;
    this.height = null;
    this.element = null;
    this.initialized = false;

    this.zoom = 1;
  }

  init(element, { width, height }) {
    this.element = element;
    this.scene = new THREE.Scene();

    this.width = width;
    this.height = height;

    this.starFieldScene = new THREE.Scene();
    this.starFieldCamera = new THREE.OrthographicCamera(
      (this.zoom * this.width) / -2,
      (this.zoom * this.width) / 2,
      (this.zoom * this.height) / 2,
      (this.zoom * this.height) / -2,
      -4000,
      30000
    );

    this.starFieldCamera.position.set(0, 0, 500);
    this.starFieldCamera.lookAt(0, 0, 100);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.renderer.context.getExtension("OES_standard_derivatives");
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    element.appendChild(this.renderer.domElement);

    this.initialized = true;
    this.starField = new StarField(this.starFieldScene, "home");

    this.render();
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.starFieldScene, this.starFieldCamera);
    this.starField.render();

    requestAnimationFrame(this.render.bind(this));
  }

  onResize({ width, height }) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.starField.resize();
  }
}

export default HomeScene;
