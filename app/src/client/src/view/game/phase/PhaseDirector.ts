import * as THREE from "three";
import { User } from "@fieryvoid3/model";
import UIState from "../ui/UIState";
import { CoordinateConverter } from "@fieryvoid3/model/src/utils/CoordinateConverter";
import GameConnector from "../GameConnector";
import ShipIconContainer from "../renderer/icon/ShipIconContainer";
import TorpedoIconContainer from "../renderer/icon/TorpedoIconContainer";
import ElectronicWarfareIndicatorService from "../renderer/electronicWarfare/ElectronicWarfareIndicatorService";
import { MovementService } from "@fieryvoid3/model/src/movement";
import WeaponFireService from "@fieryvoid3/model/src/weapon/WeaponFireService";
import TorpedoAttackService from "@fieryvoid3/model/src/weapon/TorpedoAttackService";
import PhaseState from "./PhaseState";
import GameDataCache from "./GameDataCache";
import MovementPathService from "../movement/MovementPathService";
import PhaseStrategy, {
  PhaseEventPayload,
  PhaseStrategies,
} from "./phaseStrategy/PhaseStrategy";
import { ParticleEmitterContainer } from "../animation/particle";
import GameCamera from "../GameCamera";
import GameData from "@fieryvoid3/model/src/game/GameData";
import AutomaticReplayPhaseStrategy from "./phaseStrategy/AutomaticReplayPhaseStrategy/AutomaticReplayPhaseStrategy";
import WaitingPhaseStrategy from "./phaseStrategy/WaitingPhaseStrategy";
import { GAME_STATUS } from "@fieryvoid3/model/src/game/gameStatus";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";
import LobbyPhaseStrategy from "./phaseStrategy/LobbyPhaseStrategy";
import ReplayPhaseStrategy from "./phaseStrategy/ReplayPhaseStrategy";
import DeploymentPhaseStrategy from "./phaseStrategy/DeploymentPhaseStrategy";

export type Services = {
  phaseState: PhaseState;
  shipIconContainer: ShipIconContainer;
  torpedoIconContainer: TorpedoIconContainer;
  electronicWarfareIndicatorService: ElectronicWarfareIndicatorService;
  scene: THREE.Object3D;
  movementService: MovementService;
  coordinateConverter: CoordinateConverter;
  uiState: UIState;
  currentUser: User | null;
  gameConnector: GameConnector;
  movementPathService: MovementPathService;
  weaponFireService: WeaponFireService;
  particleEmitterContainer: ParticleEmitterContainer;
  gameCamera: GameCamera;
  torpedoAttackService: TorpedoAttackService;
};

class PhaseDirector {
  private uiState: UIState;
  private currentUser: User | null;
  private shipIconContainer: ShipIconContainer | null;
  private torpedoIconContainer: TorpedoIconContainer | null;
  private electronicWarfareIndicatorService: ElectronicWarfareIndicatorService | null;
  private coordinateConverter: CoordinateConverter;
  private movementService: MovementService;
  private weaponFireService: WeaponFireService;
  private torpedoAttackService: TorpedoAttackService;
  private movementPathService: MovementPathService | null;
  private phaseStrategy: PhaseStrategy | null;
  private phaseState: PhaseState;
  private gameConnector: GameConnector;
  private scene: THREE.Object3D | null;
  private emitterContainer: ParticleEmitterContainer | null;
  private camera: GameCamera | null;
  private gameDataCache: GameDataCache;

  constructor(
    uiState: UIState,
    currentUser: User | null,
    coordinateConverter: CoordinateConverter,
    gameConnector: GameConnector
  ) {
    this.uiState = uiState;
    this.currentUser = currentUser;
    this.shipIconContainer = null;
    this.torpedoIconContainer = null;
    this.electronicWarfareIndicatorService = null;

    this.phaseStrategy = null;
    this.coordinateConverter = coordinateConverter;
    this.movementService = new MovementService();
    this.weaponFireService = new WeaponFireService();
    this.torpedoAttackService = new TorpedoAttackService();
    this.movementPathService = null;
    this.phaseState = new PhaseState();
    this.gameConnector = gameConnector;
    this.gameConnector.init(this);
    this.scene = null;
    this.emitterContainer = null;
    this.camera = null;

    this.gameDataCache = new GameDataCache();
  }

  init(
    scene: THREE.Object3D,
    emitterContainer: ParticleEmitterContainer,
    camera: GameCamera
  ) {
    this.scene = scene;
    this.emitterContainer = emitterContainer;
    this.camera = camera;

    this.shipIconContainer = new ShipIconContainer(
      scene,
      this.currentUser,
      this.coordinateConverter
    );
    this.torpedoIconContainer = new TorpedoIconContainer(scene);
    this.electronicWarfareIndicatorService =
      new ElectronicWarfareIndicatorService(
        scene,
        this.shipIconContainer,
        this.currentUser
      );

    this.movementPathService = new MovementPathService(
      scene,
      this.shipIconContainer,
      this.currentUser
    );

    this.uiState.setPhaseDirector(this);
  }

  closeReplay() {
    this.phaseStrategy?.deactivate();
    this.phaseStrategy = null;

    this.resolvePhaseStrategy();
  }

  startReplay() {
    const gameDatas = this.gameDataCache.getGameDatasForAutomaticReplay();

    if (!gameDatas) {
      return;
    }

    this.activatePhaseStrategy(AutomaticReplayPhaseStrategy);
    this.relayEvent("newTurn", { gameDatas });
  }

  receiveGameData(gameData: GameData) {
    this.gameDataCache.setCurrent(gameData);
    this.resolvePhaseStrategy();

    console.log(gameData);
  }

  receiveReplay(gameDatas: GameData[]) {
    this.receiveTurnChange(gameDatas);
  }

  receiveTurnChange(gameDatas: GameData[]) {
    this.gameDataCache.setCurrent(gameDatas[gameDatas.length - 1]);
    const replays = [...gameDatas];
    replays.splice(-1, 1);
    this.gameDataCache.setReplays(replays);

    if (!this.phaseStrategy || this.phaseStrategy.canDisturb()) {
      this.activatePhaseStrategy(AutomaticReplayPhaseStrategy);
    }

    if (this.phaseStrategy) {
      this.relayEvent("newTurn", { gameDatas });
    }
  }

  relayEvent(name: string, payload?: PhaseEventPayload) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.onEvent(name, payload);
    this.shipIconContainer?.onEvent(name, payload);
  }

  commitTurn() {
    if (!this.phaseStrategy) {
      return;
    }

    this.phaseStrategy.commitTurn(this.gameConnector);
    return this.activatePhaseStrategy(WaitingPhaseStrategy);
  }

  render(
    scene: THREE.Object3D,
    coordinateConverter: CoordinateConverter,
    zoom: number
  ) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    const renderPayload = this.phaseStrategy.render(
      coordinateConverter,
      scene,
      zoom
    );
    this.electronicWarfareIndicatorService?.render(renderPayload);
    this.uiState.render();
  }

  resolvePhaseStrategy() {
    const gameData = this.gameDataCache.getCurrent();

    if (!gameData) {
      return;
    }

    if (this.phaseStrategy && !this.phaseStrategy.canDisturb()) {
      return;
    }

    if (gameData.status === GAME_STATUS.LOBBY) {
      return this.activatePhaseStrategy(LobbyPhaseStrategy);
    }

    if (
      !this.currentUser ||
      !gameData.isPlayerInGame(this.currentUser) ||
      this.uiState.isReplay() ||
      gameData.status === GAME_STATUS.FINISHED
    ) {
      return this.activatePhaseStrategy(ReplayPhaseStrategy);
    }

    if (!gameData.isPlayerActive(this.currentUser)) {
      return this.activatePhaseStrategy(WaitingPhaseStrategy);
    }

    if (gameData.phase === GAME_PHASE.DEPLOYMENT) {
      return this.activatePhaseStrategy(DeploymentPhaseStrategy);
    }

    if (!gameData.isPlayerActive(this.currentUser)) {
      return this.activatePhaseStrategy(WaitingPhaseStrategy);
    }

    return this.activatePhaseStrategy(PhaseStrategy);
  }

  activatePhaseStrategy(phaseStrategy: PhaseStrategies) {
    const gameData = this.gameDataCache.getCurrent();

    if (!gameData) {
      return;
    }

    const {
      uiState,
      shipIconContainer,
      movementService,
      movementPathService,
      weaponFireService,
      torpedoAttackService,
    } = this.getServices();
    uiState.update(gameData);
    shipIconContainer.update(gameData);
    movementService.update(gameData, this);
    movementPathService.update(gameData);
    weaponFireService.update(gameData);
    torpedoAttackService.update(gameData);

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

  getServices(): Services {
    return {
      phaseState: this.phaseState,
      shipIconContainer: this.shipIconContainer!,
      torpedoIconContainer: this.torpedoIconContainer!,
      electronicWarfareIndicatorService:
        this.electronicWarfareIndicatorService!,
      scene: this.scene!,
      movementService: this.movementService,
      coordinateConverter: this.coordinateConverter,
      uiState: this.uiState,
      currentUser: this.currentUser,
      gameConnector: this.gameConnector,
      movementPathService: this.movementPathService!,
      weaponFireService: this.weaponFireService,
      particleEmitterContainer: this.emitterContainer!,
      gameCamera: this.camera!,
      torpedoAttackService: this.torpedoAttackService,
    };
  }

  deactivate() {}
}

export default PhaseDirector;
