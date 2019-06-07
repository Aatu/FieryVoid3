import UiStrategy from "./UiStrategy";
import * as THREE from "three";
import { HexagonSprite } from "../../renderer/sprite";

class DebugDrawLineFromSelectedShip extends UiStrategy {
  constructor() {
    super();

    this.sprites = [];
  }

  mouseOverHex(hex) {
    const { uiState, coordinateConverter, scene } = this.services;
    const ship = uiState.getSelectedShip();
    if (!ship) {
      return;
    }

    const positions = hex.drawLine(ship.getHexPosition(), 5);

    this.sprites = positions.map(position => {
      const sprite = new HexagonSprite(
        coordinateConverter.fromHexToGame(position)
      );
      scene.add(sprite.mesh);
      return sprite;
    });
  }

  mouseOutHex(hex) {
    const { scene } = this.services;
    this.sprites.forEach(sprite => {
      scene.remove(sprite.mesh);
      sprite.destroy();
    });
    this.sprites = [];
  }
}

export default DebugDrawLineFromSelectedShip;
