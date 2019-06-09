import * as THREE from "three";
import { CircleSprite, LineSprite, ShipFacingSprite } from "../renderer/sprite";

class NavigationalMovementPath {
  constructor(terrain, position, velocity, turns, coordinateConverter, scene) {
    this.terrain = terrain;
    this.position = position;
    this.velocity = velocity;
    this.turns = turns;
    this.coordinateConverter = coordinateConverter;
    this.scene = scene;

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach(object3d => {
      this.scene.remove(object3d.mesh);
      object3d.destroy();
    });
  }

  create() {
    let turns = 1000;
    let position = this.position;
    let velocity = this.velocity;

    while (turns--) {
      const {
        position: newPosition,
        velocity: newVelocity
      } = this.terrain.getGravityVectorForTurn(position, velocity);

      /*
      console.log(
        "position",
        position,
        "velocity",
        velocity,
        "newPosition",
        newPosition,
        "newVelocity",
        newVelocity
      );
      */
      velocity = newVelocity;

      this.createLine(position, newPosition);
      position = newPosition;
    }
  }

  createLine(start, end) {
    const line = new LineSprite(
      start,
      end,
      5,
      new THREE.Color(132 / 255, 165 / 255, 206 / 255),
      0.5
    );

    this.scene.add(line.mesh);
    this.objects.push(line);
  }
}

export default NavigationalMovementPath;
