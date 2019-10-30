import MovementService from "../../../../model/movement/MovementService";
import WeaponFireService from "../../../../model/weapon/WeaponFireService";
import PhaseState from "./PhaseState";
import ShipIconContainer from "../renderer/icon/ShipIconContainer";
import ElectronicWarfareIndicatorService from "../renderer/electronicWarfare/ElectronicWarfareIndicatorService";
import TerrainRenderer from "../renderer/TerrainRenderer";
import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";
import MovementPathService from "../movement/MovementPathService";
import * as gameStatus from "../../../../model/game/gameStatuses";
import * as gamePhase from "../../../../model/game/gamePhases";

import LobbyPhaseStrategy from "./phaseStrategy/LobbyPhaseStrategy";
import DeploymentPhaseStrategy from "./phaseStrategy/DeploymentPhaseStrategy";
import ReplayPhaseStrategy from "./phaseStrategy/ReplayPhaseStrategy";
import WaitingPhaseStrategy from "./phaseStrategy/WaitingPhaseStrategy";
import GamePhaseStrategy from "./phaseStrategy/GamePhaseStrategy";
import AutomaticReplayPhaseStrategy from "./phaseStrategy/AutomaticReplayPhaseStrategy/index.js";
import GameDataCache from "./GameDataCache";
import {
  ParticleEmitterContainer,
  ParticleEmitter
} from "../animation/particle";

class PhaseDirector {
  constructor(uiState, currentUser, coordinateConverter, gameConnector) {
    this.uiState = uiState;
    this.currentUser = currentUser;
    this.shipIconContainer = null;
    this.electronicWarfareIndicatorService = null;
    this.timeline = [];

    this.phaseStrategy = null;
    this.coordinateConverter = coordinateConverter;
    this.shipWindowManager = null;
    this.movementService = new MovementService();
    this.weaponFireService = new WeaponFireService();
    this.movementPathService = null;
    this.terrainRenderer = null;
    this.phaseState = new PhaseState();
    this.gameConnector = gameConnector;
    this.gameConnector.init(this);
    this.scene = null;
    this.emitterContainer = null;

    this.gameDataCache = new GameDataCache();
  }

  init(scene) {
    this.scene = scene;
    this.emitterContainer = new ParticleEmitterContainer(
      scene,
      50000,
      ParticleEmitter
    );

    this.shipIconContainer = new ShipIconContainer(scene, this.currentUser);
    this.electronicWarfareIndicatorService = new ElectronicWarfareIndicatorService(
      scene,
      this.shipIconContainer,
      this.currentUser
    );
    this.shipWindowManager = new ShipWindowManager(
      this.uiState,
      this.movementService
    );

    this.movementPathService = new MovementPathService(
      scene,
      this.shipIconContainer,
      this.currentUser
    );
    this.terrainRenderer = new TerrainRenderer(scene);

    this.uiState.setPhaseDirector(this);
  }

  closeReplay() {
    this.phaseStrategy.deactivate();
    this.phaseStrategy = null;

    this.resolvePhaseStrategy();
  }

  startReplay() {
    const gameDatas = this.gameDataCache.getGameDatasForAutomaticReplay();

    if (!gameDatas) {
      return;
    }

    this.activatePhaseStrategy(AutomaticReplayPhaseStrategy);
    this.relayEvent("newTurn", gameDatas);
  }

  receiveGameData(gameData) {
    window.gameData = this.gameDataCache;
    this.gameDataCache.setCurrent(gameData);
    this.resolvePhaseStrategy();
  }

  receiveReplay(gameDatas) {
    this.receiveTurnChange(gameDatas);
  }

  receiveTurnChange(gameDatas) {
    this.gameDataCache.setCurrent(gameDatas[gameDatas.length - 1]);
    const replays = [...gameDatas];
    replays.splice(-1, 1);
    this.gameDataCache.setReplays(replays);

    if (!this.phaseStrategy || this.phaseStrategy.canDisturb()) {
      this.activatePhaseStrategy(AutomaticReplayPhaseStrategy);
    }

    if (this.phaseStrategy) {
      this.relayEvent("newTurn", gameDatas);
    }
  }

  relayEvent(name, payload) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.onEvent(name, payload);
    this.shipIconContainer.onEvent(name, payload);
  }

  commitTurn() {
    this.phaseStrategy.commitTurn(this.gameConnector);
    return this.activatePhaseStrategy(WaitingPhaseStrategy);
  }

  render(scene, coordinateConverter, zoom) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.render(coordinateConverter, scene, zoom);
    this.electronicWarfareIndicatorService.render();
    this.uiState.render();
  }

  resolvePhaseStrategy() {
    const gameData = this.gameDataCache.getCurrent();

    if (this.phaseStrategy && !this.phaseStrategy.canDisturb()) {
      return;
    }

    if (gameData.status === gameStatus.LOBBY) {
      return this.activatePhaseStrategy(LobbyPhaseStrategy, gameData);
    }

    if (
      !this.currentUser ||
      !gameData.isPlayerInGame(this.currentUser) ||
      this.uiState.isReplay() ||
      gameData.status === gameStatus.FINISHED
    ) {
      return this.activatePhaseStrategy(ReplayPhaseStrategy, gameData);
    }

    if (!gameData.isPlayerActive(this.currentUser)) {
      return this.activatePhaseStrategy(WaitingPhaseStrategy, gameData);
    }

    if (gameData.phase === gamePhase.DEPLOYMENT) {
      return this.activatePhaseStrategy(DeploymentPhaseStrategy, gameData);
    }

    if (!gameData.isPlayerActive(this.currentUser)) {
      return this.activatePhaseStrategy(WaitingPhaseStrategy, gameData);
    }

    return this.activatePhaseStrategy(GamePhaseStrategy, gameData);
  }

  activatePhaseStrategy(phaseStrategy) {
    const gameData = this.gameDataCache.getCurrent();

    this.uiState.update(gameData);
    this.shipIconContainer.update(gameData);
    this.movementService.update(gameData, this);
    this.movementPathService.update(gameData);
    this.terrainRenderer.update(gameData.terrain);
    this.weaponFireService.update(gameData);

    if (this.phaseStrategy && this.phaseStrategy instanceof phaseStrategy) {
      this.phaseStrategy.update(gameData);
      return;
    }

    if (this.phaseStrategy) {
      this.phaseStrategy.deactivate();
    }

    this.phaseStrategy = new phaseStrategy(this.getServices());
    this.phaseStrategy.activate().update(gameData);
  }

  getServices() {
    return {
      phaseState: this.phaseState,
      shipIconContainer: this.shipIconContainer,
      electronicWarfareIndicatorService: this.electronicWarfareIndicatorService,
      scene: this.scene,
      shipWindowManager: this.shipWindowManager,
      movementService: this.movementService,
      coordinateConverter: this.coordinateConverter,
      uiState: this.uiState,
      currentUser: this.currentUser,
      gameConnector: this.gameConnector,
      movementPathService: this.movementPathService,
      weaponFireService: this.weaponFireService,
      particleEmitterContainer: this.emitterContainer
    };
  }
}

export default PhaseDirector;
