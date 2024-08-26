import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import {
  loadObject,
  cloneObject,
  IClonable,
  isMesh,
} from "../../utils/objectLoader";
import * as THREE from "three";

export const loadObject3d = async (url: string, debug: boolean = false) => {
  const object = await loadObject(url, debug);
  return new GameObject3D(object.object, object.animations);
};

export const loadShipObjectWithSockets = async (url: string) => {
  const object = await loadObject(url);

  return new GameObject3D(object.object.children[0], object.animations);
};

enum GameEntityType {
  SHIP,
  SHIP_SYSTEM,
}

type GameEntity = {
  id: number | string;
  entityType: GameEntityType;
  gameObject: GameObject3D;
};

type SocketReplacement = {
  name: string;
  id: number | string;
  entityType?: GameEntityType;
};

class GameObject3D implements IClonable {
  public scene: THREE.Object3D;
  public animations: THREE.AnimationClip[];
  private animationMixer: THREE.AnimationMixer;
  public name: string | undefined = undefined;
  private gameEntity: GameEntity | null = null;
  private objects: GameObject3D[] = [];
  private revertEmissiveCallback: (() => void) | null = null;
  private revertOpacityCallback: (() => void) | null = null;
  private revertColorCallback: (() => void) | null = null;
  private shipObjectNames: string[] = [];

  constructor(scene: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.scene = scene;
    this.animations = animations;

    this.animationMixer = new THREE.AnimationMixer(this.scene);

    this.cloneMaterials();
    this.loopAnimation("ambient");
  }

  setShipObjectNames(names: string | string[]) {
    this.shipObjectNames = ([] as string[]).concat(names);
  }

  setGameEntity(entity: GameEntity | null) {
    this.gameEntity = entity;
  }

  getGameEntity() {
    return this.gameEntity;
  }

  getObject() {
    return this.scene;
  }

  traverse(callBack: (child: THREE.Mesh) => void) {
    this.scene.traverse((child) => {
      if (isMesh(child)) {
        callBack(child);
      }
    });
  }

  traverseMaterials(callBack: (material: THREE.MeshStandardMaterial) => void) {
    this.scene.traverse((child) => {
      if (isMesh(child)) {
        ([] as THREE.MeshStandardMaterial[])
          .concat((child as THREE.Mesh).material as THREE.MeshStandardMaterial)
          .forEach(callBack);
      }
    });
  }

  getSystemObject(system: ShipSystem) {
    const systemObject = this.objects.find((object) => {
      const gameEntity = object.getGameEntity();

      if (!gameEntity) {
        return false;
      }

      return gameEntity.id === system.id;
    });

    return systemObject;
  }

  disableAnimation(name: string, system?: ShipSystem) {
    if (system) {
      const systemObject = this.getSystemObject(system);
      if (systemObject) {
        systemObject.disableAnimation(name);
      }
    }

    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }

    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 0;
    action.paused = true;
  }

  playAnimation(name: string, system?: ShipSystem) {
    if (system) {
      const systemObject = this.getSystemObject(system);
      if (systemObject) {
        systemObject.playAnimation(name);
      }
    }

    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }

    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 1;
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;
    action.time = 0;
    action.paused = false;
    action.play();
  }

  loopAnimation(name: string, system?: ShipSystem) {
    if (system) {
      const systemObject = this.getSystemObject(system);
      if (systemObject) {
        systemObject.loopAnimation(name);
      }
    }

    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }
    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 1;
    action.clampWhenFinished = true;
    action.loop = THREE.LoopRepeat;
    action.time = 0;
    action.paused = false;
    action.play();
  }

  setAnimation(name: string, time: number, system?: ShipSystem) {
    if (system) {
      const systemObject = this.getSystemObject(system);
      if (systemObject) {
        systemObject.setAnimation(name, time);
      }
    }

    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }
    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 1;
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;
    action.time = time;
    action.paused = true;
    action.play();
  }

  addTo(scene: THREE.Object3D) {
    scene.add(this.scene);
  }

  removeFrom(scene: THREE.Object3D) {
    scene.remove(this.scene);
  }

  clone() {
    const clone = cloneObject(this);
    const object = new GameObject3D(clone.object, clone.animations);
    object.setGameEntity(this.gameEntity);

    return object;
  }

  render(payload: RenderPayload) {
    this.animationMixer.update(payload.delta * 0.001);

    this.objects.forEach((object) => {
      object.render(payload);
    });
  }

  replaceEmissive(color: THREE.Color, permanent: boolean = false) {
    this.revertEmissive();

    const replacements: {
      reference: THREE.MeshStandardMaterial;
      color: THREE.Color;
      map: THREE.Texture | null;
    }[] = [];

    this.traverseMaterials((material) => {
      replacements.push({
        reference: material,
        color: material.emissive,
        map: material.emissiveMap,
      });
      material.emissive = color;
      material.emissiveMap = null;
      material.needsUpdate = true;
    });

    if (!permanent) {
      this.revertEmissiveCallback = () => {
        replacements.forEach(({ reference, color, map }) => {
          reference.emissive = color;
          reference.emissiveMap = map;
          reference.needsUpdate = true;
        });
      };
    }
  }

  revertEmissive() {
    if (this.revertEmissiveCallback) {
      this.revertEmissiveCallback();
    }
  }

  replaceOpacity(opacity: number, permanent: boolean = false) {
    this.revertEmissive();

    const replacements: {
      reference: THREE.MeshStandardMaterial;
      opacity: number;
    }[] = [];

    this.traverseMaterials((material) => {
      replacements.push({
        reference: material,
        opacity,
      });
      material.depthWrite = false;
      material.depthTest = false;
      material.transparent = true;
      material.opacity = opacity;
    });

    if (!permanent) {
      this.revertOpacityCallback = () => {
        replacements.forEach(({ reference, opacity }) => {
          reference.opacity = opacity;
          reference.depthWrite = true;
          reference.depthTest = true;
          reference.transparent = false;
        });
      };
    }
  }

  revertOpacity() {
    if (this.revertOpacityCallback) {
      this.revertOpacityCallback();
    }
  }

  replaceColor(
    color: THREE.Color,
    shipOnly: boolean = false,
    removeMap: boolean = false,
    permanent: boolean = false
  ) {
    this.revertEmissive();

    const replacements: {
      reference: THREE.MeshStandardMaterial;
      color: THREE.Color;
      map: THREE.Texture | null;
    }[] = [];

    this.traverse((object) => {
      if (!shipOnly || this.shipObjectNames.includes(object.name!)) {
        if (object.material instanceof THREE.MeshStandardMaterial) {
          replacements.push({
            reference: object.material,
            color,
            map: object.material.map,
          });

          if (removeMap) {
            object.material.map = null;
          }

          object.material.color = color;
          object.material.needsUpdate = true;
        }
      }
    });

    if (!permanent) {
      this.revertColorCallback = () => {
        replacements.forEach(({ reference, color, map }) => {
          reference.color = color;
          reference.map = map;
        });
      };
    }
  }

  revertColor() {
    if (this.revertColorCallback) {
      this.revertColorCallback();
    }
  }

  async replaceSocketByName(
    names: SocketReplacement | SocketReplacement[],
    entity: GameObject3D | null,
    objectName?: string
  ) {
    names = ([] as SocketReplacement[]).concat(names);

    names.forEach(({ name, id, entityType = GameEntityType.SHIP_SYSTEM }) => {
      const slot = this.scene.children.find((child) => {
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
        this.scene.remove(slot);
        return;
      }

      const newEntity = entity.clone();

      if (objectName) {
        newEntity.name = objectName;
        newEntity.getObject().name = objectName;
      }

      newEntity.getObject().position.copy(slot.position);
      newEntity.getObject().rotation.copy(slot.rotation);
      newEntity.getObject().quaternion.copy(slot.quaternion);
      this.scene.remove(slot);
      newEntity.addTo(this.getObject());

      if (entityType) {
        newEntity.setGameEntity({
          id,
          entityType,
          gameObject: newEntity,
        });
      }

      this.objects.push(newEntity);
    });
  }

  setBumpMap(map: THREE.Texture, bumpScale: number = 5) {
    if (!this.shipObjectNames.length) {
      throw new Error("No ship object names set");
    }

    this.traverse((object) => {
      if (this.shipObjectNames.includes(object.name!)) {
        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.bumpMap = map;
          object.material.bumpScale = bumpScale;
          object.material.bumpMap!.flipY = false;
          object.material.needsUpdate = true;
        }
      }
    });
  }

  setEmissiveMap(map: THREE.Texture) {
    if (!this.shipObjectNames.length) {
      throw new Error("No ship object names set");
    }

    this.traverse((object) => {
      if (this.shipObjectNames.includes(object.name!)) {
        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.emissiveMap = map;
          object.material.emissiveMap!.flipY = false;
          object.material.needsUpdate = true;
          object.material.emissive = new THREE.Color(0xffffff);
        }
      }
    });
  }

  setColor(color: THREE.Color) {
    if (!this.shipObjectNames.length) {
      throw new Error("No ship object names set");
    }

    this.traverse((object) => {
      if (this.shipObjectNames.includes(object.name!)) {
        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.map = null;
          object.material.color = color;
          object.material.needsUpdate = true;
        }
      }
    });
  }

  private cloneMaterials() {
    this.scene.traverse((child) => {
      if (isMesh(child)) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = child.material.clone();
        }
      }
    });
  }
}

export default GameObject3D;
