import PhaseDirector from "./phase/PhaseDirector";
import CoordinateConverter from "./utils/CoordinateConverter";
import PositionObject from "./utils/PositionObject";
import GameSettings from "./GameSettings";
import GameConnector from "./GameConnector";

import GameScene from "./GameScene";

class Game {
  constructor(gameId, user, uiState) {
    this.gameId = gameId;
    this.currentUser = user;

    this.uiState = uiState;
    this.coordinateConverter = new CoordinateConverter();

    this.gameConnector = new GameConnector(gameId);
    this.phaseDirector = new PhaseDirector(
      this.uiState,
      this.currentUser,
      this.coordinateConverter,
      this.gameConnector
    );
    this.gameScene = new GameScene(
      this.phaseDirector,
      this.coordinateConverter
    );
    this.gameSettings = new GameSettings().load();
    this.sceneElement = null;

    this.init = false;
  }

  initRender(element) {
    this.sceneElement = element;
    this.init = true;
    this.gameScene.init(element, this.getDimensions(), this.gameId);
    this.gameConnector.connect();
    this.onResize();
  }

  onMouseWheel(step) {
    this.gameScene.changeZoom(step);
  }

  onKeyDown(event) {
    const action = this.gameSettings.matchEvent(event);
    this.uiState.customEvent(action, { up: false });
  }

  onKeyUp(event) {
    const action = this.gameSettings.matchEvent(event);
    this.uiState.customEvent(action, { up: true });
  }

  onMouseUp(position) {
    if (!this.init) {
      return;
    }

    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const entities = this.coordinateConverter.getEntitiesIntersected(position);
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos, true);

    const payload = new PositionObject(position, gamePos, hexPos, entities);

    console.log(payload.hex);

    this.phaseDirector.relayEvent("ClickEvent", payload);
  }

  onDrag(position, delta) {
    this.gameScene.scroll(delta);
  }

  onMouseMove(position) {
    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos);
    const entities = this.coordinateConverter.getEntitiesIntersected(position);

    this.phaseDirector.relayEvent(
      "MouseMoveEvent",
      new PositionObject(position, gamePos, hexPos, entities)
    );
  }

  onResize() {
    if (!this.sceneElement) {
      return;
    }

    const dimensions = this.getDimensions();
    this.coordinateConverter.onResize(dimensions);
    this.gameScene.onResize(dimensions);
  }

  getDimensions() {
    return {
      width: this.sceneElement.offsetWidth,
      height: this.sceneElement.offsetHeight
    };
  }
}

export default Game;
