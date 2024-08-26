import * as THREE from "three";
import StarField from "../game/terrain/StarField";

//window.THREE = THREE;

class HomeScene {
  private renderer: THREE.WebGLRenderer | null = null;
  private width: number = 0;
  private height: number = 0;
  private starField: StarField | null = null;
  private starFieldScene: THREE.Scene | null = null;
  private starFieldCamera: THREE.OrthographicCamera | null = null;
  private zoom: number = 1;

  init(
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

    element.appendChild(this.renderer.domElement);

    this.renderer.getContext().getExtension("OES_standard_derivatives");
    this.renderer.getContext().getExtension("GL_OES_standard_derivatives");

    this.starField = new StarField(this.starFieldScene, -1);

    this.render();
  }

  isInitialized() {
    return Boolean(this.renderer);
  }

  render() {
    this.renderer!.clear();
    this.renderer!.render(this.starFieldScene!, this.starFieldCamera!);
    this.starField!.render();

    requestAnimationFrame(this.render.bind(this));
  }

  onResize({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;
    this.renderer!.setSize(window.innerWidth, window.innerHeight);
    this.starField!.resize();
  }
}

export default HomeScene;
