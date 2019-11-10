import BoltInstance from "./BoltInstance";

class BoltContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumberAttribute,
    scaleAttribute,
    quaternionAttribute,
    colorAttribute,
    velocityAttribute,
    activationGameTimeAttribute,
    deactivationGameTimeAttribute,
    deactivationFadeAttribute,
    amount,
    mesh,
    scene,
    numberCreated
  ) {
    this.amount = amount;
    this.offsetAttribute = offsetAttribute;
    this.opacityAttribute = opacityAttribute;
    this.textureNumberAttribute = textureNumberAttribute;
    this.scaleAttribute = scaleAttribute;
    this.quaternionAttribute = quaternionAttribute;
    this.colorAttribute = colorAttribute;
    this.velocityAttribute = velocityAttribute;
    this.activationGameTimeAttribute = activationGameTimeAttribute;
    this.deactivationGameTimeAttribute = deactivationGameTimeAttribute;
    this.deactivationFadeAttribute = deactivationFadeAttribute;
    this.mesh = mesh;
    this.scene = scene;
    this.numberCreated = numberCreated;

    this.free = [];
    for (let i = 0; i < this.amount; i++) {
      this.free.push(i);
    }

    this.flyBolt = new BoltInstance(this);
  }

  setPosition(position) {
    this.mesh.position.set(position.x, position.y, 0);
  }

  setRenderOrder(order) {
    //console.log(this.mesh.renderOrder);
    //console.log("setting renderOrder ", order);
    //this.mesh.renderOrder = order;
  }

  hasFree() {
    return this.free.length > 0;
  }

  discard() {
    this.scene.remove(this.mesh);
  }

  resetIndex() {
    this.used = 0;
  }

  unassignEverything() {
    const opacitys = [];

    for (let i = 0; i < this.amount; i++) {
      opacitys.push(0);
    }

    this.opacityAttribute.setArray(opacitys);
    this.opacityAttribute.needsUpdate = true;

    this.used = 0;
  }

  freeParticles(particleIndices) {
    particleIndices = [].concat(particleIndices);

    particleIndices.forEach(function(i) {
      this.opacityAttribute.setX(i, 0);
    }, this);

    this.opacityAttribute.needsUpdate = true;

    this.free = this.free.concat(particleIndices);
  }

  getParticle() {
    if (this.free.length === 0) {
      throw new Error("Container is full");
    }

    return this.flyBolt.setIndex(this.free.pop());
  }

  setOpacity(index, opacity) {
    this.opacityAttribute.setX(index, opacity);
    this.opacityAttribute.needsUpdate = true;
  }

  setPosition(index, position) {
    this.offsetAttribute.setXYZ(index, position.x, position.y, position.z);
    this.offsetAttribute.needsUpdate = true;
  }

  setScale(index, scale) {
    this.scaleAttribute.setXYZ(index, scale.x, scale.y, scale.z);
    this.scaleAttribute.needsUpdate = true;
  }

  setQuaternion(index, quaternion) {
    this.quaternionAttribute.setXYZW(
      index,
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w
    );

    this.quaternionAttribute.needsUpdate = true;
  }

  setTexture(index, texture) {
    this.textureNumberAttribute.setX(index, texture);
    this.textureNumberAttribute.needsUpdate = true;
  }

  setColor(index, color) {
    this.colorAttribute.setXYZ(index, color.r, color.g, color.b);
    this.colorAttribute.needsUpdate = true;
  }

  setVelocity(index, velocity) {
    this.velocityAttribute.setXYZ(index, velocity.x, velocity.y, velocity.z);
    this.velocityAttribute.needsUpdate = true;
  }

  setActivationTime(index, time) {
    this.activationGameTimeAttribute.setX(index, time);
    this.activationGameTimeAttribute.needsUpdate = true;
  }

  setDeactivationTime(index, time, fade = 0) {
    this.deactivationGameTimeAttribute.setX(index, time);
    this.deactivationFadeAttribute.setX(index, fade);
    this.deactivationGameTimeAttribute.needsUpdate = true;
    this.deactivationFadeAttribute.needsUpdate = true;
  }
}

export default BoltContainer;
