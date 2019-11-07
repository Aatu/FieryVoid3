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
    const start = performance.now();
    let position = this.position;
    let velocity = this.velocity;

    while (turns--) {
      const {
        position: newPosition,
        velocity: newVelocity,
        positions,
        collision
      } = this.terrain.getGravityVectorForTurn(position, velocity, 1);

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
      position = newPosition;
      //this.createLine(positions);

      if (collision) {
        break;
      }
    }

    console.log("building path took", performance.now() - start, "ms");
  }

  createLine(positions) {
    //positions.forEach(pos => console.log(pos.toString()));

    let start = positions.shift();

    positions.forEach(end => {
      const line = new LineSprite(
        start,
        end,
        5,
        new THREE.Color(132 / 255, 165 / 255, 206 / 255),
        0.5
      );

      this.scene.add(line.mesh);
      this.objects.push(line);

      start = end;
    });
  }
}

export default NavigationalMovementPath;
