import PhaseStrategy from "../PhaseStrategy";
import {
  ReplayShipWeaponFire,
  ReplayShipMovement,
  AutomaticReplay,
  ShowReplayUi,
  MouseOverShowsShipTooltip
} from "../../../ui/uiStrategy";
import ReplayContext from "./ReplayContext";

class AutomaticReplayPhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    this.emitterContainer = services.particleEmitterContainer;

    this.replayContext = new ReplayContext(this);
    this.replayShipMovement = new ReplayShipMovement(this.replayContext);
    this.replayShipWeaponFire = new ReplayShipWeaponFire(
      this.emitterContainer,
      this.replayContext
    );

    this.strategies = [
      this.replayShipMovement,
      this.replayShipWeaponFire,
      new AutomaticReplay(this, this.replayContext),
      new ShowReplayUi(this.replayContext),
      new MouseOverShowsShipTooltip()
    ];
  }

  render(coordinateConverter, scene, zoom) {
    const payload = super.render(coordinateConverter, scene, zoom);
    this.emitterContainer.render(payload);
  }

  canDisturb() {
    return false;
  }

  update(gamedata) {
    this.updateStrategies(gamedata);
    return this;
  }

  deactivate() {
    super.deactivate();
  }
}

export default AutomaticReplayPhaseStrategy;
