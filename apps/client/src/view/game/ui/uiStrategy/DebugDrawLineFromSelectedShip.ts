import UiStrategy from "./UiStrategy";
import { HexagonSprite } from "../../renderer/sprite";
import { Offset } from "@fieryvoid3/model/src/hexagon";

class DebugDrawLineFromSelectedShip extends UiStrategy {
  private sprites: HexagonSprite[] = [];

  mouseOverHex(hex: Offset) {
    const { uiState, coordinateConverter, scene } = this.getServices();
    const ship = uiState.getSelectedShip();
    if (!ship) {
      return;
    }

    const positions = hex.drawLine(ship.getHexPosition(), 5);

    this.sprites = positions.map((position) => {
      const sprite = new HexagonSprite(
        coordinateConverter.fromHexToGame(position)
      );
      scene.add(sprite.getMesh());
      return sprite;
    });
  }

  mouseOutHex() {
    const { scene } = this.getServices();
    this.sprites.forEach((sprite) => {
      scene.remove(sprite.getMesh());
      sprite.destroy();
    });
    this.sprites = [];
  }
}

export default DebugDrawLineFromSelectedShip;
