import UiStrategy from "./UiStrategy";
import * as THREE from "three";
import { HexagonSprite } from "../../renderer/sprite";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import GameData from "@fieryvoid3/model/src/game/GameData";

class ShowDeploymentAreas extends UiStrategy {
  private areas: { slot: GameSlot; sprites: HexagonSprite[] }[] = [];

  deactivate() {
    const { scene } = this.getServices();
    this.areas.forEach((area) => {
      area.sprites.forEach((sprite) => {
        scene.remove(sprite.getMesh());
        sprite.destroy();
      });
    });
  }

  update(gameData: GameData) {
    super.update(gameData);
    const { scene, coordinateConverter, currentUser } = this.getServices();

    this.areas = gameData.slots.getSlots().map((slot) => {
      const hexagons = slot.deploymentLocation.spiral(slot.deploymentRadius);

      let color = new THREE.Color(1, 1, 1);
      if (slot.isUsers(currentUser)) {
        color = new THREE.Color(39 / 255, 196 / 255, 39 / 255);
      } else if (!gameData.slots.isUsersTeamSlot(slot, currentUser)) {
        color = new THREE.Color(196 / 255, 39 / 255, 39 / 255);
      }

      return {
        slot,
        sprites: hexagons.map((hex) => {
          const sprite = new HexagonSprite(
            coordinateConverter.fromHexToGame(hex)
          );

          sprite.setOpacity(0.5);
          sprite.setOverlayColor(color);
          sprite.setOverlayColorAlpha(0.5);

          scene.add(sprite.getMesh());

          return sprite;
        }),
      };
    });
  }

  selectShip() {}
}

export default ShowDeploymentAreas;
