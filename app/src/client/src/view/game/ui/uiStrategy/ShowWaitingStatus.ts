import { Services } from "../../phase/PhaseDirector";
import UiStrategy from "./UiStrategy";

class ShowWaitingStatus extends UiStrategy {
  activate(services: Services) {
    super.activate(services);
    const { uiState } = this.this.getServices();
    uiState.setWaiting(true);
  }

  deactivate() {
    const { uiState } = this.this.getServices();
    uiState.setWaiting(false);
  }
}

export default ShowWaitingStatus;
