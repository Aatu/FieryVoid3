import UiStrategy from "./UiStrategy";
import GameSystemTooltipMenu from "../system/GameSystemTooltipMenu";

class GameSystemInfoMenuStrategy extends UiStrategy {
  activate(services) {
    super.activate(services);
    const { uiState } = this.getServices();

    uiState.setSystemInfoMenuProvider(this.getTooltipComponent);
  }

  deactivate() {
    super.deactivate();
    const { uiState } = this.getServices();

    uiState.setSystemInfoMenuProvider(null);
  }

  getTooltipComponent() {
    return GameSystemTooltipMenu;
  }
}

export default GameSystemInfoMenuStrategy;
