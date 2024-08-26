import PhaseDirector from "./phase/PhaseDirector";
import PositionObject from "./utils/PositionObject";
import GameSettings from "./GameSettings";

import GameScene from "./GameScene";
import coordinateConverter, {
  CoordinateConverter,
} from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { User } from "@fieryvoid3/model";
import UIState from "./ui/UIState";
import GameConnector from "./GameConnector";
import { Offset } from "@fieryvoid3/model/src/hexagon";

class Game {
  public gameId: number;
  public currentUser: User | null;
  public uiState: UIState;
  public coordinateConverter: CoordinateConverter;
  public gameConnector: GameConnector;
  public phaseDirector: PhaseDirector;
  public gameScene: GameScene;
  public gameSettings: GameSettings;
  public sceneElement: HTMLElement | null;
  public init: boolean;
  private mouseOvered: unknown | null;
  private mouseOveredHex: Offset | null;

  constructor(gameId: number, user: User | null, uiState: UIState) {
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

  initRender(element: HTMLElement) {
    if (this.init) {
      return;
    }

    this.sceneElement = element;
    const dimensions = this.getDimensions();

    this.init = true;
    this.gameScene.init(element, dimensions, this.gameId);
    this.gameConnector.connect();
    this.onResize();
  }

  onMouseWheel(step: number) {
    this.gameScene.changeZoom(step);
  }

  onKeyDown(event: KeyboardEvent) {
    const action = this.gameSettings.matchEvent(event);

    if (!action) {
      return;
    }

    this.uiState.customEvent(action, { up: false });
  }

  onKeyUp(event: KeyboardEvent) {
    const action = this.gameSettings.matchEvent(event);

    if (!action) {
      return;
    }

    this.uiState.customEvent(action, { up: true });
  }

  onMouseUp(
    position: { x: number; y: number; xR: number; yR: number },
    button: number
  ) {
    if (!this.init) {
      return;
    }

    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const entity = this.coordinateConverter
      .getEntitiesIntersected(position)
      .shift();
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos);

    const payload = new PositionObject(position, gamePos, hexPos, entity);
    console.log(payload.hex);

    if (button && button === 2 && entity) {
      this.phaseDirector.relayEvent("shipRightClicked", { position: payload });
    } else if (entity) {
      this.phaseDirector.relayEvent("shipClicked", { entity: payload.entity });
    } else {
      this.phaseDirector.relayEvent("hexClicked", { entity: payload.entity });
    }
  }

  onDrag(position: unknown, delta: { x: number; y: number }) {
    this.gameScene.scroll(delta);
  }

  onMouseMove(position: { x: number; y: number; xR: number; yR: number }) {
    const gamePos = this.coordinateConverter.fromViewPortToGame(position);
    const hexPos = this.coordinateConverter.fromGameToHex(gamePos);
    const entity = this.coordinateConverter
      .getEntitiesIntersected(position)
      .shift();

    const payload = new PositionObject(position, gamePos, hexPos, entity);

    if (this.mouseOvered && entity && this.mouseOvered != entity) {
      this.phaseDirector.relayEvent("mouseOutShip", {
        ...payload,
        entity: this.mouseOvered,
      });

      this.phaseDirector.relayEvent("mouseOverShip", {
        entity: payload.entity,
      });
      this.mouseOvered = entity;
    } else if (this.mouseOvered == null && entity) {
      this.phaseDirector.relayEvent("mouseOverShip", {
        entity: payload.entity,
      });
      this.mouseOvered = entity;
    } else if (this.mouseOvered && !entity) {
      this.phaseDirector.relayEvent("mouseOutShip", {
        ...payload,
        entity: this.mouseOvered,
      });
      this.mouseOvered = null;
    }

    if (!entity) {
      if (this.mouseOveredHex && !this.mouseOveredHex.equals(payload.hex)) {
        this.phaseDirector.relayEvent("mouseOutHex", {
          hex: this.mouseOveredHex,
        });
        this.phaseDirector.relayEvent("mouseOverHex", { hex: payload.hex });
        this.mouseOveredHex = payload.hex;
      } else if (!this.mouseOveredHex) {
        this.phaseDirector.relayEvent("mouseOverHex", { hex: payload.hex });
        this.mouseOveredHex = payload.hex;
      }
    } else if (entity && this.mouseOveredHex) {
      this.phaseDirector.relayEvent("mouseOutHex", {
        hex: this.mouseOveredHex,
      });
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
    if (!this.sceneElement) {
      throw new Error("Scene element not initialized");
    }

    return {
      width: this.sceneElement.offsetWidth,
      height: this.sceneElement.offsetHeight,
    };
  }

  deactivate() {
    if (!this.init) {
      return;
    }

    this.init = false;

    this.gameConnector.deactivate();
    this.phaseDirector.deactivate();
    this.gameScene.deactivate();
  }
}

export default Game;
