import PhaseDirector from "./phase/PhaseDirector";
import coordinateConverter from "../../../model/utils/CoordinateConverter";
import PositionObject from "./utils/PositionObject";
import GameSettings from "./GameSettings";
import GameConnector from "./GameConnector";

import GameScene from "./GameScene";

class Game {
  constructor(gameId, user, uiState) {
    this.gameId = gameId;
    this.currentUser = user;

    this.uiState = uiState;
    this.coordinateConverter = coordinateConverter;

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

    this.mouseOvered = null;
    this.mouseOveredHex = null;
  }

  getUiState() {
    return this.uiState;
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

  onMouseUp(position, button) {
    if (!this.init) {
      return;
    }

    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const entity = this.coordinateConverter
      .getEntitiesIntersected(position, true)
      .shift();
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos, true);

    const payload = new PositionObject(position, gamePos, hexPos, entity);
    console.log(payload.hex);

    if (button && button === 2 && entity) {
      this.phaseDirector.relayEvent("shipRightClicked", payload);
    } else if (entity) {
      this.phaseDirector.relayEvent("shipClicked", payload);
    } else {
      this.phaseDirector.relayEvent("hexClicked", payload);
    }
  }

  onDrag(position, delta) {
    this.gameScene.scroll(delta);
  }

  onMouseMove(position) {
    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos);
    const entity = this.coordinateConverter
      .getEntitiesIntersected(position)
      .shift();

    const payload = new PositionObject(position, gamePos, hexPos, entity);

    if (this.mouseOvered && entity && this.mouseOvered != entity) {
      this.phaseDirector.relayEvent("mouseOutShip", {
        ...payload,
        entity: this.mouseOvered
      });

      this.phaseDirector.relayEvent("mouseOverShip", payload);
      this.mouseOvered = entity;
    } else if (this.mouseOvered == null && entity) {
      this.phaseDirector.relayEvent("mouseOverShip", payload);
      this.mouseOvered = entity;
    } else if (this.mouseOvered && !entity) {
      this.phaseDirector.relayEvent("mouseOutShip", {
        ...payload,
        entity: this.mouseOvered
      });
      this.mouseOvered = null;
    }

    if (!entity) {
      if (this.mouseOveredHex && !this.mouseOveredHex.equals(payload.hex)) {
        this.phaseDirector.relayEvent("mouseOutHex", this.mouseOveredHex);
        this.phaseDirector.relayEvent("mouseOverHex", payload.hex);
        this.mouseOveredHex = payload.hex;
      } else if (!this.mouseOveredHex) {
        this.phaseDirector.relayEvent("mouseOverHex", payload.hex);
        this.mouseOveredHex = payload.hex;
      }
    } else if (entity && this.mouseOveredHex) {
      this.phaseDirector.relayEvent("mouseOutHex", this.mouseOveredHex);
      this.mouseOveredHex = null;
    }
  }

  onMouseOut() {
    this.phaseDirector.relayEvent("mouseOut");
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

  deactivate() {
    this.gameConnector.deactivate();
    this.phaseDirector.deactivate();
    this.gameScene.deactivate();
  }
}

export default Game;
