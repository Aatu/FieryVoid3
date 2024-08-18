import * as THREE from "three";
import * as shipObjects from ".";

import { ShipEWSprite, DottedCircleSprite, HexagonSprite } from "../sprite";

import Line from "../Line";
import { ParticleEmitterContainer } from "../../animation/particle";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { getPromise } from "@fieryvoid3/model/src/utils/ReadyPromise";
import { LoadedObject } from "../../utils/objectLoader";

class ShipObject {
  private shipId: string;
  private ship: Ship;
  private systemLocations: Record<string, THREE.Vector3>;
  private bumpMap: THREE.Texture | null;
  private scene: THREE.Scene;
  private mesh: THREE.Object3D;
  private shipObject: THREE.Object3D;
  private systemObjects: any[];
  private resolveShipObjectLoaded: any;
  private isShipObjectLoaded: Promise<boolean>;
  private mapIcon: ShipMapIcon;
  private hexSprites: HexagonSprite[];
  private hexSpriteContainer: THREE.Object3D;
  private ghostShipObject: any;
  private shipSideSprite: any;
  private shipEWSprite: ShipEWSprite;
  private shipSelectedSprite: DottedCircleSprite;
  private line: Line | null;
  private defaultHeight: number;
  private sideSpriteSize: number;
  private position: IVector;
  private shipZ: number | null;
  private hidden: boolean;
  private emissiveReplaced: any[];
  private ghost: boolean;
  private forcedEmissiveColor: THREE.Color | null;
  private opacity: number;
  private rotation: number;
  private roll: number;
  private dimensions: IVector;
  private center: IVector;
  private ewSpriteDimensions: IVector | null;
  private shipObjectBoundingBox: ShipObjectBoundingBox;
  private shipObjectSectionDamageEffect: ShipObjectSectionDamageEffect;
  private overlaySpriteSize: number = 0;
  private overlaySpriteOpacity: number = 0;
  private overlaySpriteColor: THREE.Color = new THREE.Color(0, 0, 0);
  private overlaySpriteColorAlpha: number = 0;

  constructor(ship: Ship, scene: THREE.Scene) {
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

    this.isShipObjectLoaded = getPromise<boolean>();

    this.mapIcon = null;
    this.hexSprites = [];
    this.hexSpriteContainer = new THREE.Object3D();
    this.ghostShipObject = null;
    this.shipSideSprite = null;
    this.shipEWSprite = null;
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
    this.dimensions = { x: 100, y: 100, z: 0 };
    this.center = { x: 0, y: 0, z: 0 };
    this.ewSpriteDimensions = null;

    this.shipObjectBoundingBox = new ShipObjectBoundingBox(ship);
    this.shipObjectSectionDamageEffect = new ShipObjectSectionDamageEffect(
      ship
    );

    this.consumeShipdata(this.ship);
  }

  setShipObject(object: LoadedObject) {
    this.shipObject = object;

    if (this.bumpMap) {
      object.object.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        material.bumpMap = this.bumpMap;
        material.bumpScale = 0.5;
        material.bumpMap!.flipY = false;
        material.needsUpdate = true;
      });
    }

    this.shipObject.traverse((child) => {
      child.userData = { icon: this };
    });

    object.addTo(this.mesh);
    this.resolveShipObjectLoaded(true);
  }

  clone() {
    return new shipObjects[this.ship.shipModel](this.ship, this.scene);
  }

  consumeShipdata(ship: Ship) {
    this.ship = ship;
  }

  createMesh() {
    if (this.shipZ === null) {
      this.shipZ = this.defaultHeight;
    }

    const opacity = 0.5;

    this.line = new Line(this.mesh, {
      start: new THREE.Vector3(0, 0, 0),
      end: new THREE.Vector3(0, 0, this.defaultHeight),
      width: 5,
      color: new THREE.Color(1, 1, 1),
      opacity: 0.1,
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

    //this.mesh.name = "ship";
    //this.mesh.userData = { icon: this };

    const dimensionDebugCube = () => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
        })
      );

      cube.scale.set(this.dimensions.x, this.dimensions.y, this.dimensions.z);
      cube.position.set(
        this.center.x,
        this.center.y,
        this.center.z + this.shipZ
      );
      this.hexSpriteContainer.add(cube);
    };

    //dimensionDebugCube();

    const particleContainer = new ParticleEmitterContainer(
      this.hexSpriteContainer,
      1000
    );

    this.shipObjectBoundingBox.init(this.dimensions);
    this.shipObjectSectionDamageEffect.init(
      this.shipObjectBoundingBox,
      particleContainer,
      this.shipZ,
      this.center,
      this.hexSpriteContainer
    );
    this.scene.add(this.mesh);
    this.hide();
  }

  async showEwSprite(dew, ccew, evasion) {
    await this.isShipObjectLoaded;

    if (!this.shipEWSprite) {
      const dimensions = this.ewSpriteDimensions || this.dimensions;
      const max = dimensions.x > dimensions.y ? dimensions.x : dimensions.y;

      this.shipEWSprite = new ShipEWSprite(
        { width: max * 1.5, height: max * 1.5 },
        this.shipZ,
        dimensions
      );
      this.shipEWSprite.setPosition(this.center);
      this.hexSpriteContainer.add(this.shipEWSprite.mesh);
      this.shipEWSprite.hide();
    }

    this.shipEWSprite.update(dew, ccew, evasion);
    this.shipEWSprite.show();
  }

  async hideEwSprite() {
    await this.isShipObjectLoaded;
    this.shipEWSprite.hide();
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
    this.shipObjectSectionDamageEffect.setShipZ(z);
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
      const slot = this.shipObject.scene.children.find((child) => {
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

    this.shipObject.traverse((child) => {
      child.material.depthWrite = false;
      child.material.depthTest = false;
      child.material.transparent = true;
      child.material.opacity = opacity;
      child.material.needsUpdate = true;
    });
  }

  async revertOpacity() {
    await this.isShipObjectLoaded;

    this.shipObject.traverse((child) => {
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

    this.shipObject.traverse((child) => {
      const replacement = this.emissiveReplaced.find(
        (replacement) => replacement.object === child
      );

      if (!replacement) {
        this.emissiveReplaced.push({
          object: child,
          color: child.material.emissive,
          map: child.material.emissiveMap,
        });
      }

      child.material.emissiveMap = null;
      child.material.emissive = color;
      child.material.needsUpdate = true;
    });
  }

  async revertEmissive() {
    await this.isShipObjectLoaded;
    this.shipObject.traverse((child) => {
      const replacement = this.emissiveReplaced.find(
        (replacement) => replacement.object === child
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
  }

  async replaceColor(color) {
    await this.isShipObjectLoaded;

    this.shipObject.traverse((child) => {
      child.material.map = null;
      child.material.color = color;
      child.material.needsUpdate = true;
    });
  }

  async setGhostShipEmissive(color) {
    await this.isShipObjectLoaded;

    this.forceEmissive(color);
    this.hexSprites.forEach((hexSprite) =>
      hexSprite.setOverlayColor(new THREE.Color(color))
    );
  }

  showMapIcon(color) {
    this.mapIcon.setOverlayColor(color).setOverlayColorAlpha(1).show();
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
    this.systemObjects.forEach((object) => object.render(renderPayload));
    this.shipObjectSectionDamageEffect.render(renderPayload);
  }

  playSystemAnimation(system, name) {
    const object = this.systemObjects.find((object) => object.id === system.id);

    if (!object) {
      return;
    }

    //console.log("animate", name, system);
    object.playAnimation(name);
  }

  setSystemAnimation(system, name, time) {
    const object = this.systemObjects.find((object) => object.id === system.id);

    if (!object) {
      return;
    }

    //console.log("set animation", name, system);
    object.setAnimation(name, time);
  }

  disableSystemAnimation(system, name) {
    const object = this.systemObjects.find((object) => object.id === system.id);

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
      .map((hex) => coordinateConverter.fromHexToGame(hex).add(iconPosition));
  }

  getCenter() {
    const hexas = this.getShipHexas();

    const lowest = new Vector();
    const highest = new Vector();

    hexas.forEach((position) => {
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
