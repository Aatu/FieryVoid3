import PhaseDirector from "./phase/PhaseDirector";
import CoordinateConverter from "./utils/CoordinateConverter";
import UIState from "./ui/UIState";
//import GameScene from "./GameScene";

class Game {
  constructor(gameId) {
    this.gameId = gameId;

    //this.gameScene = new GameScene();¨
    this.uiState = new UIState();
    this.phaseDirector = new PhaseDirector(this.uiState);
    this.coordinateConverter = new CoordinateConverter();
    this.sceneElement = null;

    console.log("construct game ", gameId);
  }

  initRender(element) {
    this.sceneElement = element;
    this.gameScene.init(element);
    this.onResize();
  }

  onResize() {
    if (!this.sceneElement) {
      return;
    }

    const width = this.sceneElement.offsetWidth;
    const height = this.sceneElement.offsetHeight;

    console.log(widht, height);
  }
}

export default Game;
