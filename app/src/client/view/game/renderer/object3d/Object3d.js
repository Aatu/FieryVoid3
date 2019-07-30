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

    this.object.add(this.scene);

    this.animationMixer = new THREE.AnimationMixer(this.scene);
    if (this.animations.length > 0) {
      this.animationMixer.clipAction(this.animations[0]).play();
    }
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
