import hexagon from "../../model/hexagon";
import THREE from "three";
import TerrainMovementOrder from "../movement/TerrainMovementOrder.mjs";
const TERRAIN_TYPE_SUN = "sun";

class GameTerrainEntity {
  constructor(data) {
    this.deserialize(data);
  }

  getGravityVector(start, end) {
    return new THREE.Vector3(0, 0, 0);
    /*
    let distance = position.distanceTo(this.position);

    if (distance < 2) {
      distance = 2;
    }

    const actualGravity = this.gravity / Math.pow(distance, 2);
    let effectiveGravity = 0;

    const decimal = actualGravity % 1;
    const integer = Math.floor(actualGravity);
    const sequence = Math.round(1 / decimal);

    if (turn % sequence) {
      effectiveGravity = integer + 1;
    } else {
      effectiveGravity = integer;
    }

    if (effectiveGravity === 0) {
      return new hexagon.Offset(0, 0);
    }

    console.log("effective gravity", effectiveGravity);
    return this.position
      .drawLine(position, effectiveGravity)
      .shift()
      .subtract(position);
      */
  }

  deserialize(data = {}) {
    this.id = data.id || null;
    this.type = data.type || TERRAIN_TYPE_SUN;
    this.gravity = data.gravity || 10;
    this.move = new TerrainMovementOrder().deserialize(data.move);
    this.affectedByGravity = this.type === TERRAIN_TYPE_SUN;

    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      gravity: this.gravity,
      move: this.move.serialize()
    };
  }
}

export default GameTerrainEntity;
