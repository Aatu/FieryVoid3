import MovementService from "../../../../model/movement/MovementService";
import PhaseState from "./PhaseState";
import ShipIconContainer from "../renderer/icon/ShipIconContainer";
import EWIconContainer from "../renderer/icon/EWIconContainer";
import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";
import * as gameStatus from "../../../../model/game/gameStatuses";
//import * as gamePhase from "../../../../model/game/gamePhases";

import LobbyPhaseStrategy from "./phaseStrategy/LobbyPhaseStrategy";

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
    this.uiState.setPhaseDirector(this);
  }

  init(scene) {
    this.scene = scene;
    this.shipIconContainer = new ShipIconContainer(scene, this.movementService);
    this.ewIconContainer = new EWIconContainer(scene, this.shipIconContainer);
    this.shipWindowManager = new ShipWindowManager(
      this.uiState,
      this.movementService
    );
  }

  receiveGameData(gameData) {
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
  }

  resolvePhaseStrategy(gameData) {
    if (gameData.status === gameStatus.LOBBY) {
      return this.activatePhaseStrategy(
        LobbyPhaseStrategy,
        gameData,
        this.scene
      );
    }

    if (
      !gameData.isPlayerInGame() ||
      gameData.replay ||
      gameData.status === "SURRENDERED" ||
      gameData.status === "FINISHED"
    ) {
      return this.activatePhaseStrategy(
        window.ReplayPhaseStrategy,
        gameData,
        this.scene
      );
    }

    if (gameData.waiting) {
      return this.activatePhaseStrategy(
        window.WaitingPhaseStrategy,
        gameData,
        this.scene
      );
    }

    switch (gameData.gamephase) {
      case -1:
        return this.activatePhaseStrategy(
          window.DeploymentPhaseStrategy,
          gameData,
          this.scene
        );
      case 1:
        return this.activatePhaseStrategy(
          window.InitialPhaseStrategy,
          gameData,
          this.scene
        );
      case 2:
        return this.activatePhaseStrategy(
          window.MovementPhaseStrategy,
          gameData,
          this.scene
        );
      case 3:
        return this.activatePhaseStrategy(
          window.FirePhaseStrategy,
          gameData,
          this.scene
        );
      default:
        return this.activatePhaseStrategy(
          window.WaitingPhaseStrategy,
          gameData,
          this.scene
        );
    }
  }

  activatePhaseStrategy(phaseStrategy, gameData, scene) {
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

    this.phaseStrategy = new phaseStrategy({
      phaseState: this.phaseState,
      shipIconContainer: this.shipIconContainer,
      ewIconContainer: this.ewIconContainer,
      scene: scene,
      shipWindowManager: this.shipWindowManager,
      movementService: this.movementService,
      coordinateConverter: this.coordinateConverter,
      uiState: this.uiState,
      currentUser: this.currentUser,
      gameConnector: this.gameConnector
    })
      .activate()
      .update(gameData);
  }
}

export default PhaseDirector;
