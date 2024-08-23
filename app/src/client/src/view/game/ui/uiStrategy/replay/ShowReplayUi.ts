import UiStrategy from "../UiStrategy";

class ShowReplayUi extends UiStrategy {
  constructor(replayContext: ReplayContext) {
    super();
    this.replayContext = replayContext;
  }

  activate(services) {
    super.activate(services);
    const { uiState } = this.getServices();
    uiState.showReplayUi(this.replayContext);
  }

  deactivate() {
    const { uiState } = this.getServices();
    uiState.showReplayUi(false);
  }
}

export default ShowReplayUi;
