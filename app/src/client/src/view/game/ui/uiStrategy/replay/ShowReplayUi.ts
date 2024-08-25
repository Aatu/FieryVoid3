import { Services } from "../../../phase/PhaseDirector";
import ReplayContext from "../../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";
import UiStrategy from "../UiStrategy";

class ShowReplayUi extends UiStrategy {
  private replayContext: ReplayContext;

  constructor(replayContext: ReplayContext) {
    super();
    this.replayContext = replayContext;
  }

  activate(services: Services) {
    super.activate(services);
    const { uiState } = this.getServices();
    uiState.showReplayUi(this.replayContext);
  }

  deactivate() {
    const { uiState } = this.getServices();
    uiState.showReplayUi(null);
  }
}

export default ShowReplayUi;
