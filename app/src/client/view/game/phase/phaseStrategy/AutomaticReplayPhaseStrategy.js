import PhaseStrategy from "./PhaseStrategy";
import {
  ReplayShipWeaponFire,
  ReplayShipMovement,
  AutomaticReplay
} from "../../ui/uiStrategy";
import {
  ParticleEmitterContainer,
  ParticleEmitter
} from "../../animation/particle";

class AutomaticReplayPhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    const { scene } = services;
    const replayShipMovement = new ReplayShipMovement();

    this.emitterContainer = new ParticleEmitterContainer(
      scene,
      5000,
      ParticleEmitter
    );

    this.strategies = [
      replayShipMovement,
      new ReplayShipWeaponFire(this.emitterContainer, replayShipMovement),
      new AutomaticReplay(this, 5000)
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
}

export default AutomaticReplayPhaseStrategy;
