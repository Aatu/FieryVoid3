import UiStrategy from "./UiStrategy";
import GameSystemTooltipMenu from "../system/GameSystemTooltipMenu";
import { Services } from "../../phase/PhaseDirector";

class GameSystemInfoMenuStrategy extends UiStrategy {
  activate(services: Services) {
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
