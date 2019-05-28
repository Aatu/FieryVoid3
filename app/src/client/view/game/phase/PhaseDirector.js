import MovementService from "../../../../model/movement/MovementService";
import PhaseState from "./PhaseState";
import ShipIconContainer from "../renderer/icon/ShipIconContainer";
import EWIconContainer from "../renderer/icon/EWIconContainer";
import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";
import * as gameStatus from "../../../../model/game/gameStatuses";
import * as gamePhase from "../../../../model/game/gamePhases";

import LobbyPhaseStrategy from "./phaseStrategy/LobbyPhaseStrategy";
import DeploymentPhaseStrategy from "./phaseStrategy/DeploymentPhaseStrategy";
import ReplayPhaseStrategy from "./phaseStrategy/ReplayPhaseStrategy";
import WaitingPhaseStrategy from "./phaseStrategy/WaitingPhaseStrategy";
import GamePhaseStrategy from "./phaseStrategy/GamePhaseStrategy";

class PhaseDirector {
  constructor(uiState, currentUser, coordinateConverter, gameConnector) {
    this.uiState = uiState;
    this.currentUser = currentUser;
    this.shipIconContainer = null;
    this.ewIconContainer = null;
    this.timeline = [];

    this.phaseStrategy = null;
    this.coordinateConverter = coordinateConverter;
    this.shipWindowManager = null;
    this.movementService = new MovementService();
    this.phaseState = new PhaseState();
    this.gameConnector = gameConnector;
    this.gameConnector.init(this);
    this.scene = null;
  }

  init(scene) {
    this.scene = scene;
    this.shipIconContainer = new ShipIconContainer(scene, this.currentUser);
    this.ewIconContainer = new EWIconContainer(scene, this.shipIconContainer);
    this.shipWindowManager = new ShipWindowManager(
      this.uiState,
      this.movementService
    );

    this.uiState.setPhaseDirector(this);
  }

  receiveGameData(gameData) {
    window.gameData = gameData;
    this.resolvePhaseStrategy(gameData);
  }

  relayEvent(name, payload) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.onEvent(name, payload);
    this.shipIconContainer.onEvent(name, payload);
    this.ewIconContainer.onEvent(name, payload);
  }

  render(scene, coordinateConverter, zoom) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.render(coordinateConverter, scene, zoom);
    this.uiState.render();
  }

  resolvePhaseStrategy(gameData) {
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

    if (gameData.phase === gamePhase.DEPLOYMENT) {
      return this.activatePhaseStrategy(DeploymentPhaseStrategy, gameData);
    }

    if (!gameData.isPlayerActive(this.currentUser)) {
      return this.activatePhaseStrategy(WaitingPhaseStrategy, gameData);
    }

    return this.activatePhaseStrategy(GamePhaseStrategy, gameData);
  }

  activatePhaseStrategy(phaseStrategy, gameData) {
    this.shipIconContainer.update(gameData);
    this.movementService.update(gameData, this);
    this.ewIconContainer.update(gameData, this.shipIconContainer);

    if (this.phaseStrategy && this.phaseStrategy instanceof phaseStrategy) {
      this.phaseStrategy.update(gameData);
      return;
    }

    if (this.phaseStrategy) {
      this.phaseStrategy.deactivate();
    }

    this.phaseStrategy = new phaseStrategy(this.getServices())
      .activate()
      .update(gameData);
  }

  getServices() {
    return {
      phaseState: this.phaseState,
      shipIconContainer: this.shipIconContainer,
      ewIconContainer: this.ewIconContainer,
      scene: this.scene,
      shipWindowManager: this.shipWindowManager,
      movementService: this.movementService,
      coordinateConverter: this.coordinateConverter,
      uiState: this.uiState,
      currentUser: this.currentUser,
      gameConnector: this.gameConnector
    };
  }
}

export default PhaseDirector;
