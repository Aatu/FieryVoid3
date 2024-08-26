import GameData from "@fieryvoid3/model/src/game/GameData";
import { Services } from "../PhaseDirector";
import { CoordinateConverter } from "@fieryvoid3/model/src/utils/CoordinateConverter";
import * as THREE from "three";
import GameConnector from "../../GameConnector";
import LobbyPhaseStrategy from "./LobbyPhaseStrategy";
import WaitingPhaseStrategy from "./WaitingPhaseStrategy";
import AutomaticReplayPhaseStrategy from "./AutomaticReplayPhaseStrategy/AutomaticReplayPhaseStrategy";
import ReplayPhaseStrategy from "./ReplayPhaseStrategy";
import DeploymentPhaseStrategy from "./DeploymentPhaseStrategy";
import UiStrategy from "../../ui/uiStrategy/UiStrategy";
import GamePhaseStrategy from "./GamePhaseStrategy";

export type PhaseStrategies =
  | typeof LobbyPhaseStrategy
  | typeof WaitingPhaseStrategy
  | typeof PhaseStrategy
  | typeof AutomaticReplayPhaseStrategy
  | typeof ReplayPhaseStrategy
  | typeof DeploymentPhaseStrategy
  | typeof GamePhaseStrategy;

export type RenderPayload = {
  delta: number;
  total: number;
  last: number | null;
  zoom: number;
  reverse: boolean;
  paused: boolean;
};

/*
const getInterestingStuffInPosition = (payload, shipIconContainer) => {
  const mouseovered = payload.entities.filter(
    (entity) =>
      entity instanceof window.ShipObject && !entity.ship.isDestroyed()
  );

  if (mouseovered.length > 0) {
    return mouseovered;
  }

  return shipIconContainer
    .getIconsInProximity(payload)
    .filter((icon) => !icon.ship.isDestroyed());
};
*/

export type PhaseEventPayload = Record<string, unknown> & { stopped?: boolean };

class PhaseStrategy {
  services: Services;
  strategies: UiStrategy[];
  inactive: boolean;
  gameData: GameData | null;
  animationPaused: boolean;
  animationReversed: boolean;
  currentDeltaTime: number;
  animationStartTime: number;
  totalAnimationTime: number;
  lastAnimationTime: number | null;
  animationEndtime: number;
  animationTurnLength: number | null;

  constructor(services: Services) {
    this.services = services;
    this.strategies = [];
    this.inactive = true;

    this.gameData = null;

    this.animationPaused = true;
    this.animationReversed = false;
    this.currentDeltaTime = 0;
    this.animationStartTime = 0;
    this.totalAnimationTime = 0;
    this.lastAnimationTime = 0;
    this.animationEndtime = 0;
    this.animationTurnLength = null;
  }

  getGameData() {
    if (!this.gameData) {
      throw new Error("No game data available");
    }

    return this.gameData;
  }

  onEvent(name: string, payload?: PhaseEventPayload) {
    this.callStrategies(name, payload);
  }

  updateStrategies(gamedata: GameData) {
    this.strategies.forEach((strategy) => strategy.update(gamedata));
  }

  activateStrategies() {
    this.strategies.forEach((strategy) => strategy.activate(this.services));
  }

  callStrategies(functionName: string, payload: PhaseEventPayload = {}) {
    this.strategies.forEach((strategy) => {
      if (
        strategy[functionName as keyof UiStrategy] &&
        typeof strategy[functionName as keyof UiStrategy] === "function" &&
        (!payload || !(payload as { stopped: boolean })?.stopped)
      ) {
        // @ts-expect-error dynamic thingy
        strategy[functionName as keyof PhaseStrategy](payload);
      }
    });
  }

  render(
    coordinateConverter: CoordinateConverter,
    scene: THREE.Object3D,
    zoom: number
  ): RenderPayload {
    this.updateDeltaTime();
    this.updateTotalAnimationTime();

    const { shipIconContainer, torpedoIconContainer } = this.services;

    const renderPayload: RenderPayload = {
      delta: this.currentDeltaTime,
      total: this.totalAnimationTime,
      last: this.lastAnimationTime,
      zoom,
      reverse: false,
      paused: false,
    };

    this.callStrategies("render", renderPayload);

    if (shipIconContainer) shipIconContainer.render(renderPayload);

    if (torpedoIconContainer) torpedoIconContainer.render(renderPayload);
    return renderPayload;
  }

  animateFromTo(start: number, end: number) {
    this.animationStartTime = start;
    this.totalAnimationTime = start;
    this.animationReversed = false;
    this.lastAnimationTime = null;
    this.currentDeltaTime = 0;
    this.animationEndtime = end;
    this.animationPaused = false;
  }

  pauseAnimation() {
    this.animationPaused = true;
  }

  unpauseAnimation() {
    this.animationReversed = false;
    this.animationPaused = false;
  }

  unpauseAndRewindAnimation() {
    this.animationReversed = true;
    this.animationPaused = false;
  }

  setAnimationTime(time: number) {
    this.totalAnimationTime = time;
    this.lastAnimationTime = null;
    this.currentDeltaTime = 0;
  }

  updateTotalAnimationTime() {
    if (this.animationPaused) {
      return;
    }

    if (this.animationReversed) {
      this.totalAnimationTime -= this.currentDeltaTime;
      if (this.totalAnimationTime < this.animationStartTime) {
        this.totalAnimationTime = this.animationStartTime;
        this.animationPaused = true;
      }
    } else {
      this.totalAnimationTime += this.currentDeltaTime;
      if (
        this.animationEndtime &&
        this.totalAnimationTime >= this.animationEndtime
      ) {
        this.totalAnimationTime = this.animationEndtime;
        this.animationPaused = true;
      }
    }
  }

  updateDeltaTime() {
    const now = Date.now();

    if (!this.lastAnimationTime) {
      this.lastAnimationTime = now;
      this.currentDeltaTime = 0;
    }

    this.currentDeltaTime = now - this.lastAnimationTime;

    this.lastAnimationTime = now;
  }

  update(gamedata: GameData) {
    const { uiState } = this.services;

    this.gameData = gamedata;
    this.updateStrategies(gamedata);
    uiState.gameDataUpdated();
    return this;
  }

  activate() {
    console.log("PhaseStrategy activate", this.constructor.name);
    this.inactive = false;
    this.activateStrategies();
    return this;
  }

  deactivate() {
    this.inactive = true;
    this.callStrategies("deactivate");

    return this;
  }

  triggerEvent(name: string, payload: PhaseEventPayload = {}) {
    this.callStrategies(name, payload);
  }

  onScrollEvent(payload: PhaseEventPayload) {
    this.callStrategies("onScroll", payload);
  }

  onZoomEvent(payload: PhaseEventPayload) {
    this.callStrategies("onZoom", payload);
  }

  canDisturb() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  commitTurn(gameConnector: GameConnector) {}
}

export default PhaseStrategy;
