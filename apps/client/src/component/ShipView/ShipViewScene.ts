import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import ShipObject from "../../view/game/renderer/ships/ShipObject";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { createShipObject } from "../../view/game/renderer/icon/ShipIconContainer";

export class ShipViewScene {
  private renderer: THREE.WebGLRenderer | null = null;
  public scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera | null = null;
  private element: HTMLElement | null = null;
  public uuid: string = uuidv4();

  public init(element?: HTMLElement) {
    if (this.isInitialized()) {
      return;
    }

    this.element = element || null;

    this.camera = new THREE.OrthographicCamera(
      1 / -2,
      1 / 2,
      1 / 2,
      1 / -2,
      -4000,
      4000
    );

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
    });

    if (element) {
      element.appendChild(this.renderer.domElement);
    }

    const light = new THREE.PointLight(0xffffff, 1000.0, 0);
    light.position.set(0, 0, 100000);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0x35527a, 1);
    directionalLight.position.set(0, 0, 1).normalize();
    this.scene.add(directionalLight);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight3.position.set(0, 1, 1).normalize();
    directionalLight3.castShadow = true;
    this.scene.add(directionalLight3);

    //const directionalLight4 = new THREE.DirectionalLight(0x609dc1, 0.5);
    const directionalLight4 = new THREE.DirectionalLight(0xfff3a6, 0.2);
    directionalLight4.position.set(0, -1, 1);
    this.scene.add(directionalLight4);

    //this.camera.position.z = 100;
  }

  public async showShip(size: number, ship: Ship) {
    if (!this.renderer) {
      throw new Error("Not initialize");
    }

    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const shipObject = createShipObject(ship, this.scene);

    await shipObject.isLoaded.promise;

    this.setCamera(size, shipObject);

    shipObject.getShipObjectSync().getObject().position.set(0, 0, 0);
    shipObject.show();

    this.animate(shipObject);
  }

  private setCamera(size: number, shipObject: ShipObject) {
    if (!this.camera) {
      throw new Error("Not initialized");
    }

    const distance = (() => {
      if (shipObject.dimensions.x > shipObject.dimensions.y) {
        return shipObject.dimensions.x;
      } else {
        return shipObject.dimensions.y;
      }
    })();

    const ratio = (distance / size) * 2;

    this.camera.left = (ratio * size) / -2;
    this.camera.right = (ratio * size) / 2;
    this.camera.top = (ratio * size) / 2;
    this.camera.bottom = (ratio * size) / -2;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();

    this.camera.position.set(0, -distance, distance);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  public async renderShipImage(size: number, ship: Ship) {
    if (!this.renderer) {
      throw new Error("Not initialize");
    }

    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const shipObject = createShipObject(ship, this.scene);

    await shipObject.isLoaded.promise;

    this.setCamera(size, shipObject);

    shipObject.getShipObjectSync().getObject().position.set(0, 0, 0);
    shipObject.show();

    this.render();

    const image = this.renderer.domElement.toDataURL("image/jpeg");
    shipObject.hide();

    return image;
  }

  public isInitialized() {
    return Boolean(this.renderer);
  }

  private animate(shipObject: ShipObject) {
    if (!this.renderer) {
      throw new Error("not initialized");
    }

    const render = (shipObject: ShipObject) => {
      //this.renderer!.clear();

      shipObject.getShipObjectSync().getObject().rotateZ(0.001);
      this.renderer!.render(this.scene!, this.camera!);
    };

    this.renderer.setAnimationLoop(render.bind(this, shipObject));
  }

  private render() {
    this.renderer!.render(this.scene!, this.camera!);
  }

  public deactivate() {
    if (this.element) {
      this.element.removeChild(this.renderer!.domElement);
    }

    if (this.renderer) {
      this.renderer.clear();
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
  }
}
