import UiStrategy from "../UiStrategy";

class ShowReplayUi extends UiStrategy {
  constructor(replayContext) {
    super();
    this.replayContext = replayContext;
  }

  activate(services) {
    super.activate(services);
    const { uiState } = this.services;
    uiState.showReplayUi(this.replayContext);
  }

  deactivate() {
    const { uiState } = this.services;
    uiState.showReplayUi(false);
  }
}

export default ShowReplayUi;
