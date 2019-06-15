import UiStrategy from "./UiStrategy";

class ShowWaitingStatus extends UiStrategy {
  activate(services) {
    super.activate(services);
    const { uiState } = this.services;
    uiState.setWaiting(true);
  }

  deactivate() {
    const { uiState } = this.services;
    uiState.setWaiting(false);
  }
}

export default ShowWaitingStatus;
