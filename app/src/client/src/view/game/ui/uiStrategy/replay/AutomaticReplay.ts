import UiStrategy from "../UiStrategy";
import PhaseStrategy, {
  RenderPayload,
} from "../../../phase/phaseStrategy/PhaseStrategy";
import ReplayContext from "../../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";

class AutomaticReplay extends UiStrategy {
  private phaseStrategy: PhaseStrategy;
  private replayContext: ReplayContext;

  constructor(phaseStrategy: PhaseStrategy, replayContext: ReplayContext) {
    super();
    this.phaseStrategy = phaseStrategy;
    this.replayContext = replayContext;
  }

  async newTurn() {
    const { shipIconContainer } = this.getServices();

    await shipIconContainer.shipsLoaded();

    setTimeout(() => {
      this.phaseStrategy.animateFromTo(0, 0);
    }, 500);
  }

  render({ total }: RenderPayload) {
    if (total >= this.replayContext.getTurnLength() + 2000) {
      const { uiState } = this.getServices();
      uiState.closeReplay();
    }
  }
}

export default AutomaticReplay;
