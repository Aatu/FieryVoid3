import * as THREE from "three";
import * as shipObjects from ".";
import Vector from "../../../../../model/utils/Vector.mjs";

import { degreeToRadian } from "../../../../../model/utils/math";

import {
  LineSprite,
  CircleSprite,
  ShipEWSprite,
  DottedCircleSprite
} from "../sprite";

import Line from "../Line";
import Object3d from "../object3d/Object3d";

const COLOR_MINE = new THREE.Color(39 / 255, 196 / 255, 39 / 255);
const COLOR_ENEMY = new THREE.Color(255 / 255, 40 / 255, 40 / 255);

class ShipObject {
  constructor(ship, scene) {
    this.shipId = ship.id;
    this.ship = ship;

    this.scene = scene;
    this.mesh = new THREE.Object3D();
    //this.mesh.castShadow = true;
    //this.mesh.receiveShadow = true;
    this.shipObject = null;
    this.systemObjects = [];

    this.resolveShipObjectLoaded = null;
    this.isShipObjectLoaded = new Promise((resolve, reject) => {
      this.resolveShipObjectLoaded = resolve;
    });

    this.ghostShipObject = null;
    this.shipSideSprite = null;
    this.shipEWSprite = null;
    this.shipSelectedSprite = null;
    this.line = null;

    this.defaultHeight = 50;
    this.sideSpriteSize = 100;
    this.position = { x: 0, y: 0, z: 0 };
    this.shipZ = null;

    this.movements = null;

    this.hidden = false;

    this.startRotation = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };

    this.emissiveReplaced = [];

    this.ghost = false;
    this.forcedEmissiveColor = null;
    this.opacity = 1;

    this.consumeShipdata(this.ship);
  }

  setShipObject(object) {
    this.shipObject = object;
    object.addTo(this.mesh);
    this.resolveShipObjectLoaded(true);
  }

  clone() {
    return new shipObjects[this.ship.shipModel](this.ship, this.scene);
  }

  consumeShipdata(ship) {
    this.ship = ship;
  }

  createMesh() {
    if (this.shipZ === null) {
      this.shipZ = this.defaultHeight;
    }

    const opacity = 0.5;
    this.line = new Line(this.mesh, {
      start: { x: 0, y: 0, z: 1 },
      end: { x: 0, y: 0, z: this.defaultHeight },
      width: 1,
      color: new THREE.Color(1, 1, 1),
      opacity
    });

    this.shipSelectedSprite = new DottedCircleSprite(
      { width: this.overlaySpriteSize, height: this.overlaySpriteSize },
      this.defaultHeight,
      opacity
    );

    /*
    this.shipSelectedSprite.setOverlayColor(COLOR_MINE);
    this.shipSelectedSprite.setOverlayColorAlpha(1);
    this.mesh.add(this.shipSelectedSprite.mesh);
    //shipSelectedSprite.hide();
    */

    this.shipSideSprite = new CircleSprite(
      { width: this.sideSpriteSize, height: this.sideSpriteSize },
      0.01,
      opacity
    );
    this.mesh.add(this.shipSideSprite.mesh);

    this.shipEWSprite = new ShipEWSprite(
      { width: this.sideSpriteSize * 1.5, height: this.sideSpriteSize },
      this.defaultHeight
    );
    this.mesh.add(this.shipEWSprite.mesh);
    this.shipEWSprite.hide();

    this.mesh.name = "ship";
    this.mesh.userData = { icon: this };
    this.scene.add(this.mesh);
    this.hide();
  }

  create() {
    this.createMesh();
  }

  async setPosition(x, y) {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }

    this.position = { x, y, z: 0 };

    if (this.mesh) {
      this.mesh.position.set(x, y, 0);
    }

    await this.isShipObjectLoaded;
    this.shipObject.object.position.set(0, 0, this.shipZ);
  }

  setShipZ(z) {
    this.shipZ = z;
    this.setPosition(this.position);
  }

  getPosition() {
    return new Vector(this.position);
  }

  async setRotation(x, y, z) {
    this.rotation = { x, y, z };

    await this.isShipObjectLoaded;
    this.shipObject.object.rotation.set(
      degreeToRadian(x + this.startRotation.x),
      degreeToRadian(y + this.startRotation.y),
      degreeToRadian(z + this.startRotation.z)
    );
  }

  getRotation() {
    return this.rotation;
  }

  async setOpacity(opacity) {
    await this.isShipObjectLoaded;
    this.opacity = opacity;
    this.replaceOpacity(opacity);
  }

  hide() {
    if (this.hidden) {
      return;
    }

    this.scene.remove(this.mesh);
    this.hidden = true;
  }

  show() {
    if (!this.hidden) {
      return;
    }

    this.scene.add(this.mesh);
    this.hidden = false;
  }

  getFacing() {
    return this.getRotation().y;
  }

  setFacing(facing) {
    this.setRotation(0, facing, 0);
  }

  setOverlayColorAlpha(alpha) {}

  getMovements(turn) {
    return this.movements.filter(function(movement) {
      return turn === undefined || movement.turn === turn;
    }, this);
  }

  setScale(width, height) {
    //console.log("ShipObject.setScale is not yet implemented")
    //console.trace();
  }

  showEW() {
    if (this.shipEWSprite) {
      this.shipEWSprite.show();
    }
  }

  hideEW() {
    if (this.shipEWSprite) {
      this.shipEWSprite.hide();
    }
  }

  showSideSprite(value) {
    //console.log("ShipObject.showSideSprite is not yet implemented")
  }

  setHighlighted(value) {
    //console.log("ShipObject.showSideSprite is not yet implemented")
  }

  setSideSpriteOpacity(opacity) {
    this.shipSideSprite.multiplyOpacity(opacity);
    this.line.multiplyOpacity(opacity);
  }

  showBDEW() {
    var BDEW = this.ship.ew.getBDEW();
    if (!BDEW || this.BDEWSprite) {
      return;
    }

    var hexDistance = window.coordinateConverter.getHexDistance();
    var dis = 20 * hexDistance;

    var color = this.ship.player.isMine()
      ? new THREE.Color(160 / 255, 250 / 255, 100 / 255)
      : new THREE.Color(255 / 255, 157 / 255, 0 / 255);

    var geometry = new THREE.CircleGeometry(dis, 64, 0);
    var material = new THREE.MeshBasicMaterial({
      color: color,
      opacity: 0.2,
      transparent: true
    });
    var circle = new THREE.Mesh(geometry, material);
    circle.position.z = -1;
    this.mesh.add(circle);
    this.BDEWSprite = circle;

    return null;
  }

  hideBDEW() {
    this.mesh.remove(this.BDEWSprite);
    this.BDEWSprite = null;
  }

  async replaceSocketByName(names, entity) {
    names = [].concat(names);

    await this.isShipObjectLoaded;

    names.forEach(({ name, id }) => {
      const slot = this.shipObject.scene.children.find(child => {
        if (!child.name) {
          return false;
        }

        if (child.name === name) {
          return true;
        }
      });

      const newEntity = entity.clone().setId(id);
      newEntity.object.position.copy(slot.position);
      newEntity.object.rotation.copy(slot.rotation);
      newEntity.object.quaternion.copy(slot.quaternion);
      this.shipObject.scene.remove(slot);
      newEntity.addTo(this.shipObject.object);

      this.systemObjects.push(newEntity);
    });
  }

  async replaceOpacity(opacity) {
    await this.isShipObjectLoaded;

    this.shipObject.traverse(child => {
      child.material.transparent = true;
      child.material.opacity = opacity;
      child.material.needsUpdate = true;
    });
  }

  revertOpacity() {
    this.shipObject.traverse(child => {
      child.material.opacity = this.opacity;
      child.material.needsUpdate = true;
    });
  }

  forceEmissive(color) {
    this.forcedEmissiveColor = color;
    this.replaceEmissive(color);
    this.emissiveReplaced = [];
  }

  async replaceEmissive(color) {
    await this.isShipObjectLoaded;

    this.shipObject.traverse(child => {
      const replacement = this.emissiveReplaced.find(
        replacement => replacement.object === child
      );

      if (!replacement) {
        this.emissiveReplaced.push({
          object: child,
          color: child.material.emissive,
          map: child.material.emissiveMap
        });
      }

      child.material.emissiveMap = null;
      child.material.emissive = color;
      child.material.needsUpdate = true;
    });
  }

  async revertEmissive() {
    await this.isShipObjectLoaded;
    this.shipObject.traverse(child => {
      const replacement = this.emissiveReplaced.find(
        replacement => replacement.object === child
      );

      if (this.forcedEmissiveColor) {
        child.material.emissiveMap = null;
        child.material.emissive = this.forcedEmissiveColor;
        child.material.needsUpdate = true;
      } else if (replacement) {
        child.material.emissiveMap = replacement.map;
        child.material.emissive = replacement.color;
        child.material.needsUpdate = true;
      }
    });
  }

  setGhostShip(mine) {
    this.ghost = true;
    this.setGhostShipEmissive(mine);
    this.setOpacity(0.2);
  }

  async setGhostShipEmissive(mine) {
    await this.isShipObjectLoaded;
    this.mesh.remove(this.shipSideSprite.mesh);
    //this.mesh.remove(this.line.mesh);

    if (mine) {
      this.forceEmissive(new THREE.Color(39 / 255, 196 / 255, 39 / 255));
      this.line.setColor(new THREE.Color(39 / 255, 196 / 255, 39 / 255));
    } else {
      this.forceEmissive(new THREE.Color(196 / 255, 39 / 255, 39 / 255));
      this.line.setColor(new THREE.Color(196 / 255, 39 / 255, 39 / 255));
    }
  }

  isGhostShip() {
    return this.ghost;
  }

  render(renderPayload) {
    this.systemObjects.forEach(object => object.render(renderPayload));
  }

  playSystemAnimation(system, name) {
    const object = this.systemObjects.find(object => object.id === system.id);

    if (!object) {
      return;
    }

    //console.log("animate", name, system);
    object.playAnimation(name);
  }

  setSystemAnimation(system, name, time) {
    const object = this.systemObjects.find(object => object.id === system.id);

    if (!object) {
      return;
    }

    //console.log("set animation", name, system);
    object.setAnimation(name, time);
  }

  disableSystemAnimation(system, name) {
    const object = this.systemObjects.find(object => object.id === system.id);

    if (!object) {
      return;
    }

    //console.log("disable", name, system);
    object.disableAnimation(name);
  }
}

export default ShipObject;
