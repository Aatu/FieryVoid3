import * as THREE from "three";
import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import ExplosionEffect from "../effect/ExplosionEffect";
import { degreeToRadian } from "../../../../../model/utils/math.mjs";

class ShipWeaponAnimation extends Animation {
  constructor(props) {
    super(props.getRandom);
    this.particleEmitterContainer = props.particleEmitterContainer;
    this.props = props;
  }

  getLocationForSystem(system, icon, facing) {
    const location = icon.systemLocations[system.id];

    if (!location) {
      return new Vector();
    }

    const object = new THREE.Object3D();
    object.rotation.z = degreeToRadian(-facing);
    const result = location.clone();
    result.applyQuaternion(object.quaternion);
    result.z += icon.shipZ;
    return result;
  }
}

export default ShipWeaponAnimation;
