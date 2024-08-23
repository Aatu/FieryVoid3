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
import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";
import MovementPathService from "../movement/MovementPathService";
import TerrainRenderer from "../renderer/TerrainRenderer";
import PhaseStrategy from "./phaseStrategy/PhaseStrategy";
import { ParticleEmitterContainer } from "../animation/particle";
import GameCamera from "../GameCamera";
import GameData from "@fieryvoid3/model/src/game/GameData";

export type Services = {
  phaseState: PhaseState;
  shipIconContainer: ShipIconContainer;
  torpedoIconContainer: TorpedoIconContainer;
  electronicWarfareIndicatorService: ElectronicWarfareIndicatorService;
  scene: THREE.Object3D;
  shipWindowManager: ShipWindowManager;
  movementService: MovementService;
  coordinateConverter: CoordinateConverter;
  uiState: UIState;
  currentUser: User;
  gameConnector: GameConnector;
  movementPathService: MovementPathService;
  weaponFireService: WeaponFireService;
  particleEmitterContainer: ParticleEmitterContainer;
  gameCamera: GameCamera;
  torpedoAttackService: TorpedoAttackService;
};

class PhaseDirector {
  private uiState: UIState;
  private currentUser: User;
  private shipIconContainer: ShipIconContainer | null;
  private torpedoIconContainer: TorpedoIconContainer | null;
  private electronicWarfareIndicatorService: ElectronicWarfareIndicatorService | null;
  private coordinateConverter: CoordinateConverter;
  private shipWindowManager: ShipWindowManager | null;
  private movementService: MovementService;
  private weaponFireService: WeaponFireService;
  private torpedoAttackService: TorpedoAttackService;
  private movementPathService: MovementPathService | null;
  private terrainRenderer: TerrainRenderer | null;
  private phaseStrategy: PhaseStrategy | null;
  private phaseState: PhaseState;
  private gameConnector: GameConnector;
  private scene: THREE.Object3D | null;
  private emitterContainer: ParticleEmitterContainer | null;
  private camera: GameCamera | null;
  private gameDataCache: GameDataCache;

  constructor(
    uiState: UIState,
    currentUser: User,
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
    this.shipWindowManager = null;
    this.movementService = new MovementService();
    this.weaponFireService = new WeaponFireService();
    this.torpedoAttackService = new TorpedoAttackService();
    this.movementPathService = null;
    this.terrainRenderer = null;
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
    this.relayEvent("newTurn", gameDatas);
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
      this.relayEvent("newTurn", gameDatas);
    }
  }

  relayEvent(name: string, payload: unknown) {
    if (!this.phaseStrategy || this.phaseStrategy.inactive) {
      return;
    }

    this.phaseStrategy.onEvent(name, payload);
    this.shipIconContainer?.onEvent(name, payload);
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
    this.electronicWarfareIndicatorService.render(zoom);
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
    this.torpedoAttackService.update(gameData);

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
      shipWindowManager: this.shipWindowManager!,
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
