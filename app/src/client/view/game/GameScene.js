import * as THREE from "three";
import HexGridRenderer from "./renderer/hexgrid/HexGridRender";
import StarField from "./terrain/StarField";
import { ZOOM_MAX, ZOOM_MIN } from "../../../model/gameConfig";
import Line from "../game/renderer/Line";
import LineSprite from "../game/renderer/sprite/LineSprite";

window.THREE = THREE;

class GameScene {
  constructor(phaseDirector, coordinateConverter) {
    this.phaseDirector = phaseDirector;
    this.coordinateConverter = coordinateConverter;
    this.hexGridRenderer = new HexGridRenderer();

    this.scene = null;
    this.camera = null;
    this.starFieldScene = null;
    this.starFieldCamera = null;
    this.starField = null;
    this.width = null;
    this.height = null;

    this.element = null;

    this.initialized = false;

    this.zoom = 1;
    this.zoomTarget = this.zoom;

    this.cameraAngle = 0; //-500;
  }

  init(element, { width, height }, gameId) {
    this.element = element;

    this.scene = new THREE.Scene();

    this.width = width;
    this.height = height;

    this.camera = new THREE.OrthographicCamera(
      (this.zoom * this.width) / -2,
      (this.zoom * this.width) / 2,
      (this.zoom * this.height) / 2,
      (this.zoom * this.height) / -2,
      -40000,
      30000
    );

    this.camera.position.set(0, this.cameraAngle, 500);
    this.camera.lookAt(0, 0, 0);
    this.setCameraAngle(-250);

    this.coordinateConverter.init(this.camera, this.scene);
    this.phaseDirector.init(this.scene);

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
    this.starFieldCamera.lookAt(0, 0, 0);

    /*
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    */
    /*
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 50);
    this.scene.add(hemiLight);
    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 100);
    this.scene.add(hemiLightHelper);
    */

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 1, 0).normalize();
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight3.position.set(0, 1, 1).normalize();
    directionalLight3.castShadow = true;
    //this.scene.add(directionalLight3);
    //this.directionalLight3 = directionalLight3;

    //const directionalLight4 = new THREE.DirectionalLight(0x609dc1, 0.5);
    const directionalLight4 = new THREE.DirectionalLight(0xfff3a6, 0.02);
    directionalLight4.position.set(0, -1, 1);
    this.scene.add(directionalLight4);

    /*
    const line = new Line(
      this.scene,
      { x: 406.5864317029974, y: 534.742785792575, z: 0 },
      { x: 567.692147554496, y: 627.757214207425, z: 0 },
      2,
      new THREE.Color(1, 0, 0)
    );

    new Line(
      this.scene,
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 100 },
      2,
      new THREE.Color(1, 0, 0)
    );

    */
    /*
    const line2 = new Line(
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 2000, z: 0 },
      10,
      new THREE.Color(1, 0, 0)
    );
    this.scene.add(line2.mesh);
    */

    /*
    const helper = new THREE.DirectionalLightHelper(directionalLight4, 5);

    this.scene.add(helper);
    */

    this.scene.add(new THREE.AmbientLight(0x010101, 0.1));
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.renderer.context.getExtension("OES_standard_derivatives");
    this.renderer.shadowMapEnabled = true;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;

    element.appendChild(this.renderer.domElement);

    this.initialized = true;
    this.hexGridRenderer.renderHexGrid(this.scene, ZOOM_MIN, ZOOM_MAX);
    this.starField = new StarField(this.starFieldScene, gameId);

    this.render();
  }

  setCameraAngleRelative(newAngle) {
    this.setCameraAngle(this.cameraAngle + newAngle);
  }

  setCameraAngle(newAngle) {
    if (newAngle > 0) {
      newAngle = 0;
    }

    if (newAngle < -500) {
      newAngle = -500;
    }

    var currentLookat = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y - this.cameraAngle,
      this.camera.position.z - 500
    );
    var delta = this.cameraAngle - newAngle;
    this.camera.position.set(
      this.camera.position.x,
      this.camera.position.y - delta,
      this.camera.position.z
    );
    this.camera.lookAt(currentLookat);
    this.cameraAngle = newAngle;
  }

  scroll(delta) {
    this.moveCamera({
      x: delta.x * (1 / this.zoom),
      y: delta.y * (1 / this.zoom)
    });
  }

  moveCamera(position) {
    if (!this.initialized) {
      return;
    }

    this.camera.position.x -= position.x * this.zoom * this.zoom;
    this.camera.position.y += position.y * this.zoom * this.zoom;
    this.starFieldCamera.position.x -=
      position.x * this.zoom * this.zoom * 0.05;
    this.starFieldCamera.position.y +=
      position.y * this.zoom * this.zoom * 0.05;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.position);
  }

  moveCameraTo(position) {
    if (!this.initialized) {
      return;
    }

    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.starFieldCamera.position.x = position.x * 0.1;
    this.starFieldCamera.position.y = position.y * 0.1;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.position);
  }

  zoomCamera(zoom, animationReady) {
    this.zoom = zoom;

    if (!this.initialized) {
      return;
    }

    this.camera.left = (this.zoom * this.width) / -2;
    this.camera.right = (this.zoom * this.width) / 2;
    this.camera.top = (this.zoom * this.height) / 2;
    this.camera.bottom = (this.zoom * this.height) / -2;

    this.camera.updateProjectionMatrix();

    this.coordinateConverter.onZoom(this.zoom);
    this.hexGridRenderer.onZoom(this.zoom);

    this.phaseDirector.relayEvent("ZoomEvent", {
      zoom: this.zoom,
      animationReady: Boolean(animationReady)
    });

    var alpha = zoom > 6 ? zoom - 6 : 0;
    if (alpha > 1) {
      alpha = 1;
    }

    //jQuery("#background").css({ opacity: 1 - alpha });
  }

  render() {
    this.phaseDirector.render(this.scene, this.coordinateConverter, this.zoom);

    this.renderer.clear();
    this.renderer.render(this.starFieldScene, this.starFieldCamera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);

    this.animateZoom();
    this.starField.render();

    //this.directionalLight3.position.y += 0.005;
    //this.directionalLight3.position.y -= 0.05;

    //time++

    //this.setCameraAngleRelative(time * 0.001);
    /*

        if (this.ship) {

            this.ship.setRotation(time/3,time/3, 0);
        }

        if (this.testObject2) {

            this.testObject2.rotation.set(mathlib.degreeToRadian(90 + time/3), mathlib.degreeToRadian(90 + time/3), 0);
        }

        */

    //this.testParticleEmitter.render(time, time, 0, 0, 1);
    //this.cube.position.set(0, 0, time)

    requestAnimationFrame(this.render.bind(this));
  }

  animateZoom() {
    if (this.zoomTarget && this.zoomTarget !== this.zoom) {
      var change = (this.zoomTarget - this.zoom) * 0.1;
      if (
        Math.abs(change) < 0.00001 ||
        (this.zoomTarget === 1 && Math.abs(change) < 0.00001)
      ) {
        this.zoomCamera(this.zoomTarget, true);
      } else {
        this.zoomCamera(this.zoom + change);
      }
    }
  }

  onResize({ width, height }) {
    this.width = width;
    this.height = height;

    this.zoomCamera(this.zoom);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.starField.cleanUp();
  }

  changeZoom(zoom) {
    zoom *= 0.5;
    if (zoom < -0.5) zoom = -0.5;

    this.zoominprogress = false;
    var newzoom = this.zoom + this.zoom * zoom;

    if (newzoom < ZOOM_MIN) newzoom = ZOOM_MIN;

    if (newzoom > ZOOM_MAX) newzoom = ZOOM_MAX;

    this.zoomTarget = newzoom;
  }
}

export default GameScene;
