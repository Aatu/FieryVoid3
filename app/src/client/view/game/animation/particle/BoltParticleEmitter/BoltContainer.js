import BoltInstance from "./BoltInstance";

class BoltContainer {
  constructor(
    offsetAttribute,
    opacityAttribute,
    textureNumberAttribute,
    scaleAttribute,
    quaternionAttribute,
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
    this.mesh = mesh;
    this.scene = scene;
    this.numberCreated = numberCreated;

    this.free = [];
    for (let i = 0; i < this.amount; i++) {
      this.free.push(i);
    }
    /*
      for (let i = 0; i < amount; i++) {
        this.free.push(i);
      }
      */

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
    return this.used < this.amount;
  }

  discard() {
    this.scene.remove(this.mesh);
  }

  remove(tile) {
    this.opacityAttribute.setX(tile.index, 0);
    this.used--;
  }

  resetIndex() {
    this.used = 0;
  }

  unassignEverything() {
    this.opacityAttribute.setArray(new Float32Array(this.amount));
    this.opacityAttribute.needsUpdate = true;

    this.used = 0;
  }

  getFreeIndex() {
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
  /*
  update(data, index) {


    this.textureNumber1Attribute.setXYZW(
      index,
      data[3],
      data[4],
      data[5],
      data[6]
    );

    this.textureNumber2Attribute.setXYZW(
      index,
      data[7],
      data[8],
      data[9],
      data[10]
    );

    this.typeAttribute.setXYZ(index, data[11], data[12], data[13]);
  }
  */
}

export default BoltContainer;
