import * as THREE from "three";
import * as shipObjects from ".";
import Vector from "../../../../../model/utils/Vector.mjs";

import { degreeToRadian } from "../../../../../model/utils/math";

import {
  LineSprite,
  CircleSprite,
  ShipEWSprite,
  DottedCircleSprite,
  HexagonSprite
} from "../sprite";

import Line from "../Line";
import Object3d from "../object3d/Object3d";
import coordinateConverter from "../../../../../model/utils/CoordinateConverter.mjs";
import ShipMapIcon from "./ShipMapIcon";
import { angleToHexFacing } from "../../../../../model/utils/math.mjs";
import { radianToDegree } from "../../../../../model/utils/math.mjs";

const COLOR_MINE = new THREE.Color(39 / 255, 196 / 255, 39 / 255);
const COLOR_ENEMY = new THREE.Color(255 / 255, 40 / 255, 40 / 255);

class ShipObject {
  constructor(ship, scene) {
    this.shipId = ship.id;
    this.ship = ship;
    this.systemLocations = {};

    this.bumpMap = null;

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

    this.mapIcon = null;
    this.hexSprites = [];
    this.hexSpriteContainer = new THREE.Object3D();
    this.ghostShipObject = null;
    this.shipSideSprite = null;
    //this.shipEWSprite = null;
    this.shipSelectedSprite = null;
    this.line = null;

    this.defaultHeight = 50;
    this.sideSpriteSize = 100;
    this.position = { x: 0, y: 0, z: 0 };
    this.shipZ = null;

    this.hidden = false;

    this.emissiveReplaced = [];

    this.ghost = false;
    this.forcedEmissiveColor = null;
    this.opacity = 1;

    this.rotation = 0;
    this.roll = 0;

    this.consumeShipdata(this.ship);
  }

  setShipObject(object) {
    this.shipObject = object;

    if (this.bumpMap) {
      object.scene.children.forEach(mesh => {
        mesh.material.bumpMap = this.bumpMap;
        mesh.material.bumpScale = 0.5;
        mesh.material.bumpMap.flipY = false;
        mesh.material.needsUpdate = true;
      });
    }

    this.shipObject.traverse(child => {
      child.userData = { icon: this };
    });

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
      start: { x: 0, y: 0, z: 0 },
      end: { x: 0, y: 0, z: this.defaultHeight },
      width: 5,
      color: new THREE.Color(1, 1, 1),
      opacity: 0.1
    });
    this.line.hide();

    this.shipSelectedSprite = new DottedCircleSprite(
      { width: this.overlaySpriteSize, height: this.overlaySpriteSize },
      this.defaultHeight,
      opacity
    );

    //this.ship.hexSizes.forEach(position => {
    const sprite = new HexagonSprite(new Vector(0, 0))
      .setOpacity(0.5)
      .setOverlayColorAlpha(1);
    this.hexSprites.push(sprite);
    this.hexSpriteContainer.add(sprite.mesh);
    //});

    this.hexSpriteContainer.visible = false;

    this.mapIcon = new ShipMapIcon(this);
    this.mapIcon.addTo(this.mesh);

    this.mesh.add(this.hexSpriteContainer);
    /*
    this.shipSelectedSprite.setOverlayColor(COLOR_MINE);
    this.shipSelectedSprite.setOverlayColorAlpha(1);
    this.mesh.add(this.shipSelectedSprite.mesh);
    //shipSelectedSprite.hide();
    */

    /*
    this.shipSideSprite = new CircleSprite(
      { width: this.sideSpriteSize, height: this.sideSpriteSize },
      0.01,
      opacity
    );
    this.mesh.add(this.shipSideSprite.mesh);
    */

    /*
    this.shipEWSprite = new ShipEWSprite(
      { width: this.sideSpriteSize * 1.5, height: this.sideSpriteSize },
      this.defaultHeight
    );
    this.mesh.add(this.shipEWSprite.mesh);
    this.shipEWSprite.hide();
    */

    //this.mesh.name = "ship";
    //this.mesh.userData = { icon: this };
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

  async setRotation() {
    await this.isShipObjectLoaded;

    this.shipObject.object.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      degreeToRadian(this.rotation)
    );

    const tmpQuaternion = new THREE.Quaternion();
    tmpQuaternion
      .setFromAxisAngle(
        new THREE.Vector3(1, 0, 0).normalize(),
        degreeToRadian(this.roll)
      )
      .normalize();

    this.shipObject.object.quaternion.multiply(tmpQuaternion);
    this.hexSpriteContainer.rotation.z = degreeToRadian(this.rotation);
    this.mapIcon.setRotation(this.rotation);
  }

  async setFacing(rotation) {
    if (this.rotation === rotation) {
      return;
    }

    this.rotation = rotation;
    this.setRotation();
  }

  getFacing() {
    return -this.rotation;
  }

  async setRoll(roll) {
    if (this.roll === roll) {
      return;
    }

    this.roll = roll;
    this.setRotation();
  }

  getRoll() {
    return this.roll;
  }

  async setOpacity(opacity) {
    await this.isShipObjectLoaded;
    this.opacity = opacity;
    this.replaceOpacity(opacity);
  }

  hideShip() {
    if (!this.shipObject) {
      return;
    }

    this.shipObject.object.visible = false;
  }

  showShip() {
    if (!this.shipObject) {
      return;
    }

    this.shipObject.object.visible = true;
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

  setOverlayColorAlpha(alpha) {}

  /*
  getMovements(turn) {
    return this.movements.filter(function(movement) {
      return turn === undefined || movement.turn === turn;
    }, this);
  }
*/

  setScale(width, height) {}

  showSideSprite(value) {}

  setHighlighted(value) {}

  setSideSpriteOpacity(opacity) {}

  /*
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

*/
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

      if (!slot) {
        return;
      }

      if (!entity) {
        this.shipObject.scene.remove(slot);
        return;
      }

      const newEntity = entity.clone().setId(id);
      newEntity.object.position.copy(slot.position);
      newEntity.object.rotation.copy(slot.rotation);
      newEntity.object.quaternion.copy(slot.quaternion);
      this.shipObject.scene.remove(slot);
      newEntity.addTo(this.shipObject.object);

      this.systemObjects.push(newEntity);
      this.systemLocations[id] = slot.position;
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

  async revertOpacity() {
    await this.isShipObjectLoaded;

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
    //this.setGhostShipEmissive(mine);
    //this.setOpacity(0.2);
  }

  async setGhostShipEmissive(color) {
    await this.isShipObjectLoaded;

    this.forceEmissive(color);
    this.hexSprites.forEach(hexSprite =>
      hexSprite.setOverlayColor(new THREE.Color(color))
    );
  }

  showMapIcon(color) {
    this.mapIcon
      .setOverlayColor(color)
      .setOverlayColorAlpha(1)
      .show();
    this.hideShip();
  }

  hideMapIcon() {
    this.mapIcon.hide();
    this.showShip();
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

  getShipHexas() {
    const iconPosition = this.getPosition();
    const iconFacing = this.getFacing();
    const hexFacing = angleToHexFacing(iconFacing);

    return this.ship
      .getIconHexas(hexFacing)
      .map(hex => coordinateConverter.fromHexToGame(hex).add(iconPosition));
  }

  getCenter() {
    const hexas = this.getShipHexas();

    const lowest = new Vector();
    const highest = new Vector();

    hexas.forEach(position => {
      if (position.x < lowest.x) {
        lowest.x = position.x;
      }

      if (position.y < lowest.y) {
        lowest.y = position.y;
      }

      if (position.x > highest.x) {
        highest.x = position.x;
      }

      if (position.y < highest.y) {
        highest.y = position.y;
      }
    });

    return lowest.add(highest).multiplyScalar(0.5);
  }
}

export default ShipObject;
