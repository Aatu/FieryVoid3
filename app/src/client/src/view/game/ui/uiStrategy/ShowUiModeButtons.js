import UiStrategy from "./UiStrategy";

class ShowUiModeButtons extends UiStrategy {
  activate(services) {
    super.activate(services);
    const { uiState } = this.services;
    uiState.showUiModeButtons(true);
  }

  deactivate() {
    const { uiState } = this.services;
    uiState.showUiModeButtons(false);
  }
}

export default ShowUiModeButtons;
