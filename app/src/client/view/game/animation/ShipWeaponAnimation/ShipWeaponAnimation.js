import * as THREE from "three";
import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import ExplosionEffect from "../effect/ExplosionEffect";
import { degreeToRadian } from "../../../../../model/utils/math.mjs";

class ShipWeaponAnimation extends Animation {
  constructor(getRandom) {
    super(getRandom);
  }

  getLocationForSystem(system, icon, facing) {
    const location = icon.systemLocations[system.id];

    if (!location) {
      return new Vector();
    }

    const object = new THREE.Object3D();
    object.rotation.z = degreeToRadian(-facing);
    return location.clone().applyQuaternion(object.quaternion);
  }
}

export default ShipWeaponAnimation;
