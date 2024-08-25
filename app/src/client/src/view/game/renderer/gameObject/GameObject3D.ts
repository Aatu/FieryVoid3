import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import { loadObject, cloneObject, IClonable } from "../../utils/objectLoader";
import * as THREE from "three";

export const loadObject3d = async (url: string) => {
  const object = await loadObject(url);
  return new GameObject3D(object.object, object.animations);
};

class GameObject3D implements IClonable {
  private id: number | null;
  private object: THREE.Object3D;
  public scene: THREE.Object3D;
  public animations: THREE.AnimationClip[];
  private animationMixer: THREE.AnimationMixer;

  constructor(scene: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.id = null;

    this.object = new THREE.Object3D();
    this.scene = scene;
    this.animations = animations;

    this.object.add(this.scene);

    this.animationMixer = new THREE.AnimationMixer(this.scene);
    this.loopAnimation("ambient");
  }

  getId() {
    return this.id;
  }

  getObject() {
    return this.object;
  }

  traverse(callBack: (child: THREE.Object3D) => void) {
    this.object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        callBack(child);
      }

      if (child instanceof GameObject3D) {
        // @ts-expect-error this probalby never happens
        child.traverse(callBack);
      }
    });
  }

  traverseMaterials(callBack: (material: THREE.MeshStandardMaterial) => void) {
    this.object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        ([] as THREE.MeshStandardMaterial[])
          .concat((child as THREE.Mesh).material as THREE.MeshStandardMaterial)
          .forEach(callBack);
      }
    });
  }

  disableAnimation(name: string) {
    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }

    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 0;
    action.paused = true;
  }

  playAnimation(name: string) {
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

  loopAnimation(name: string) {
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

  setAnimation(name: string, time: number) {
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
    scene.add(this.object);
  }

  removeFrom(scene: THREE.Object3D) {
    scene.remove(this.object);
  }

  clone() {
    const clone = cloneObject(this);
    const object = new GameObject3D(clone.object, clone.animations);
    object.setId(this.id);
    return object;
  }

  setId(id: number | null) {
    this.id = id;
    return this;
  }

  render({ delta }: RenderPayload) {
    this.animationMixer.update(delta * 0.001);
  }
}

export default GameObject3D;
