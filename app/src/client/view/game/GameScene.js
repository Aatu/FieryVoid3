import * as THREE from "three";
import HexGridRenderer from "./renderer/hexgrid/HexGridRender";
import StarField from "./terrain/StarField";
import { ZOOM_MAX, ZOOM_MIN } from "../../../model/gameConfig";
import { ParticleEmitterContainer } from "./animation/particle";
import LineSprite from "./renderer/sprite/LineSprite";
import Vector from "../../../model/utils/Vector.mjs";
import { loadObject } from "./utils/objectLoader";
import GameCamera from "./GameCamera";
import TorpedoObject from "./renderer/ships/TorpedoObject";
import TorpedoFlight from "../../../model/unit/TorpedoFlight.mjs";

window.THREE = THREE;

class GameScene {
  constructor(phaseDirector, coordinateConverter) {
    this.phaseDirector = phaseDirector;
    this.coordinateConverter = coordinateConverter;
    this.hexGridRenderer = new HexGridRenderer();
    this.particleEmitterContainer = null;
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

    this.particleEmitterContainer = new ParticleEmitterContainer(
      this.scene,
      2000
    );

    this.width = width;
    this.height = height;

    this.camera = new GameCamera(this.zoom, this.width, this.height, 10000);

    this.coordinateConverter.init(this.camera, this.scene);
    this.phaseDirector.init(
      this.scene,
      this.particleEmitterContainer,
      this.camera
    );

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

    this.light = new THREE.PointLight(0xffffff, 1.0, 0);
    this.light.position.set(0, 0, 100000);
    this.scene.add(this.light);

    const directionalLight = new THREE.DirectionalLight(0x35527a, 0.005);
    directionalLight.position.set(0, 0, 1).normalize();
    this.scene.add(directionalLight);

    /*
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight3.position.set(0, 1, 1).normalize();
    directionalLight3.castShadow = true;
    //this.scene.add(directionalLight3);
    this.directionalLight3 = directionalLight3;

    //const directionalLight4 = new THREE.DirectionalLight(0x609dc1, 0.5);
    const directionalLight4 = new THREE.DirectionalLight(0xfff3a6, 0.02);
    directionalLight4.position.set(0, -1, 1);
    //this.scene.add(directionalLight4);
*/
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

    //this.scene.add(new THREE.AmbientLight(0x0a0f17));
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.renderer.context.getExtension("OES_standard_derivatives");
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;

    element.appendChild(this.renderer.domElement);

    this.initialized = true;
    this.hexGridRenderer.renderHexGrid(this.scene, ZOOM_MIN, ZOOM_MAX);
    this.starField = new StarField(this.starFieldScene, gameId);

    this.render();
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

    this.camera.addPosition({
      x: position.x * this.zoom * this.zoom * -1,
      y: position.y * this.zoom * this.zoom
    });
    //this.camera.position.x -= position.x * this.zoom * this.zoom;
    //this.camera.position.y += position.y * this.zoom * this.zoom;
    this.starFieldCamera.position.x -=
      position.x * this.zoom * this.zoom * 0.05;
    this.starFieldCamera.position.y +=
      position.y * this.zoom * this.zoom * 0.05;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.getPosition());
  }

  moveCameraTo(position) {
    if (!this.initialized) {
      return;
    }

    this.camera.setPosition({ x: position.x, y: position.y });

    //this.camera.position.x = position.x;
    //this.camera.position.y = position.y;
    this.starFieldCamera.position.x = position.x * 0.1;
    this.starFieldCamera.position.y = position.y * 0.1;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.getPosition());
  }

  zoomCamera(zoom, animationReady) {
    this.zoom = zoom;

    if (!this.initialized) {
      return;
    }

    this.camera.zoomCamera(this.zoom, this.width, this.height);
    this.coordinateConverter.onZoom(this.zoom);
    this.hexGridRenderer.onZoom(this.zoom);

    this.phaseDirector.relayEvent("ZoomEvent", {
      zoom: this.zoom,
      animationReady: Boolean(animationReady)
    });
  }

  render() {
    this.phaseDirector.render(this.scene, this.coordinateConverter, this.zoom);

    this.renderer.clear();
    this.renderer.render(this.starFieldScene, this.starFieldCamera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera.getCamera());

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
    this.starField.resize();
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
