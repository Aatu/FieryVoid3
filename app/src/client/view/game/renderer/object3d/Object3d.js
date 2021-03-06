import { loadObject, cloneObject } from "../../utils/objectLoader";
import * as THREE from "three";

export const loadObject3d = async url => {
  const object = await loadObject(url);
  return new Object3d(object.scene, object.animations);
};

class Object3d {
  constructor(scene, animations) {
    this.id = null;

    this.object = new THREE.Object3D();
    this.scene = scene;
    this.animations = animations;
    this.actions = [];

    this.object.add(this.scene);

    this.animationMixer = new THREE.AnimationMixer(this.scene);
    this.loopAnimation("ambient");
  }

  traverse(callBack) {
    this.object.traverse(child => {
      if (child.isMesh) {
        callBack(child);
      }

      if (child instanceof Object3d) {
        child.traverse(callBack);
      }
    });
  }

  disableAnimation(name) {
    const clip = THREE.AnimationClip.findByName(this.animations, name);

    if (!clip) {
      return;
    }

    const action = this.animationMixer.clipAction(clip);
    action.reset();
    action.weight = 0;
    action.paused = true;
  }

  playAnimation(name) {
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

  loopAnimation(name) {
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

  setAnimation(name, time) {
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

  addTo(scene) {
    scene.add(this.object);
  }

  removeFrom(scene) {
    scene.remove(this.object);
  }

  clone() {
    const clone = cloneObject(this);
    const object = new Object3d(clone.scene, clone.animations);
    object.setId(this.id);
    return object;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  render({ delta }) {
    this.animationMixer.update(delta * 0.001);
  }
}

export default Object3d;
