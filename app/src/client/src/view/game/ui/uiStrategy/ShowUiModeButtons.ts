import { Services } from "../../phase/PhaseDirector";
import UiStrategy from "./UiStrategy";

class ShowUiModeButtons extends UiStrategy {
  activate(services: Services) {
    super.activate(services);
    const { uiState } = this.getServices();
    uiState.showUiModeButtons(true);
  }

  deactivate() {
    const { uiState } = this.getServices();
    uiState.showUiModeButtons(false);
  }
}

export default ShowUiModeButtons;
