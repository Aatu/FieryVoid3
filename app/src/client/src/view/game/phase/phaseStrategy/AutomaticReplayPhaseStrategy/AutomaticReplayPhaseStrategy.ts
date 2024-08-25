import * as THREE from "three";
import PhaseStrategy from "../PhaseStrategy";

import ReplayContext from "./ReplayContext";
import { Services } from "../../PhaseDirector";
import { ParticleEmitterContainer } from "../../../animation/particle";
import { CoordinateConverter } from "@fieryvoid3/model/src/utils/CoordinateConverter";
import GameData from "@fieryvoid3/model/src/game/GameData";
import ReplayTurnActions from "../../../ui/uiStrategy/replay/ReplayTurnActions";
import {
  AutomaticReplay,
  MouseOverShowsShipTooltip,
  ShowMapIcons,
  ShowReplayUi,
  UnderHexForShips,
} from "../../../ui/uiStrategy";

class AutomaticReplayPhaseStrategy extends PhaseStrategy {
  private emitterContainer: ParticleEmitterContainer;
  private replayContext: ReplayContext;
  private replayTurnActions: ReplayTurnActions;

  constructor(services: Services) {
    super(services);

    this.emitterContainer = services.particleEmitterContainer;

    this.replayContext = new ReplayContext(this);
    this.replayTurnActions = new ReplayTurnActions(this.replayContext);

    this.strategies = [
      this.replayTurnActions,
      new AutomaticReplay(this, this.replayContext),
      new ShowReplayUi(this.replayContext),
      new MouseOverShowsShipTooltip(),
      new UnderHexForShips(),
      new ShowMapIcons(),
    ];
  }

  render(
    coordinateConverter: CoordinateConverter,
    scene: THREE.Object3D,
    zoom: number
  ) {
    const payload = super.render(coordinateConverter, scene, zoom);
    this.emitterContainer.render(payload);

    return payload;
  }

  canDisturb() {
    return false;
  }

  update(gamedata: GameData) {
    this.updateStrategies(gamedata);
    return this;
  }

  deactivate() {
    return super.deactivate();
  }

  commitTurn(): void {}
}

export default AutomaticReplayPhaseStrategy;
