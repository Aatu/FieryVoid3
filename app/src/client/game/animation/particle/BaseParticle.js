import * as THREE from "three";
import { degreeToRadian } from "../../../../model/utils/math";

const changeAttribute = (geometry, index, key, values) => {
  values = [].concat(values);

  var target = geometry.attributes[key].array;

  values.forEach(function(value, i) {
    target[index * values.length + i] = value;
  });

  geometry.attributes[key].needsUpdate = true;
};

class BaseParticle {
  constructor(material, geometry) {
    this.material = material;
    this.geometry = geometry;
    this.index = 0;

    this.texture = {
      gas: 0,
      bolt: 1,
      glow: 2,
      ring: 3,
      starLine: 4
    };
  }

  creat(index) {
    this.index = index;
    return this;
  }

  setInitialValues() {
    this.setPosition({ x: 0, y: 0 });
    this.setColor(new THREE.Color(0, 0, 0));
    this.setOpacity(0.0);
    this.setFadeIn(0.0, 0.0);
    this.setFadeOut(0.0, 0.0);
    this.setSize(0.0);
    this.setSizeChange(0.0);
    this.setAngle(0.0);
    this.setAngleChange(0.0);
    this.setActivationTime(0.0);
    this.setVelocity(new THREE.Vector3(0, 0, 0));
    this.setAcceleration(new THREE.Vector3(0, 0, 0));
    this.setTexture(this.texture.glow);

    return this;
  }

  setTextur(tex) {
    changeAttribute(this.geometry, this.index, "textureNumber", tex);

    return this;
  }

  setSiz(size) {
    changeAttribute(this.geometry, this.index, "size", size);
    return this;
  }

  setSizeChang(size) {
    changeAttribute(this.geometry, this.index, "sizeChange", size);
    return this;
  }

  setColor(color) {
    changeAttribute(this.geometry, this.index, "color", [
      color.r,
      color.g,
      color.b
    ]);
    return this;
  }

  setOpacity(opacity) {
    changeAttribute(this.geometry, this.index, "opacity", opacity);
    return this;
  }

  setFadeIn(time, speed = 1000) {
    changeAttribute(this.geometry, this.index, "fadeInTime", time);
    changeAttribute(this.geometry, this.index, "fadeInSpeed", speed);
    return this;
  }

  setFadeOut(time, speed = 1000) {
    changeAttribute(this.geometry, this.index, "fadeOutTime", time);
    changeAttribute(this.geometry, this.index, "fadeOutSpeed", speed);
    return this;
  }

  setPosition(pos) {
    changeAttribute(
      this.geometry,
      this.index,
      "position",
      [pos.x, pos.y, 0],
      true
    );
    return this;
  }

  setAngl(angle) {
    changeAttribute(this.geometry, this.index, "angle", degreeToRadian(angle));
    return this;
  }

  setAngleChang(angle) {
    changeAttribute(
      this.geometry,
      this.index,
      "angleChange",
      degreeToRadian(angle)
    );
    return this;
  }

  setVelocity(velocity) {
    changeAttribute(this.geometry, this.index, "velocity", [
      velocity.x,
      velocity.y,
      0
    ]);
    return this;
  }

  setAcceleration(acceleration) {
    changeAttribute(this.geometry, this.index, "acceleration", [
      acceleration.x,
      acceleration.y,
      0
    ]);
    return this;
  }

  deactivat() {
    this.setInitialValues();
    return this;
  }

  setActivationTim(gameTime) {
    changeAttribute(this.geometry, this.index, "activationGameTime", gameTime);
    return this;
  }
}

export default BaseParticle;
