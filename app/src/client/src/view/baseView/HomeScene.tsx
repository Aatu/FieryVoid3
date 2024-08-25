import * as THREE from "three";
import StarField from "../game/terrain/StarField";

//window.THREE = THREE;

class HomeScene {
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;
  private starField: StarField;
  private starFieldScene: THREE.Scene;
  private starFieldCamera: THREE.OrthographicCamera;
  private zoom: number = 1;

  constructor(
    element: HTMLElement,
    { width, height }: { width: number; height: number }
  ) {
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
    const gl = (this.renderer.domElement.getContext("webgl") ||
      this.renderer.domElement.getContext(
        "experimental-webgl"
      )) as WebGLRenderingContext;

    gl.getExtension("OES_standard_derivatives");
    gl.getExtension("GL_OES_standard_derivatives");

    element.appendChild(this.renderer.domElement);

    this.starField = new StarField(this.starFieldScene, -1);

    this.render();
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.starFieldScene, this.starFieldCamera);
    this.starField.render();

    requestAnimationFrame(this.render.bind(this));
  }

  onResize({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.starField.resize();
  }
}

export default HomeScene;
