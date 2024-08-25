import UiStrategy from "./UiStrategy";
import { Services } from "../../phase/PhaseDirector";
import GameShipTooltipMenu from "../shipTooltip/GameShipTooltipMenu";

class GameShipTooltipMenuStrategy extends UiStrategy {
  activate(services: Services) {
    super.activate(services);
    const { uiState } = this.getServices();

    uiState.setTooltipMenuProvider(this.getTooltipComponent);
  }

  deactivate() {
    super.deactivate();
    const { uiState } = this.getServices();

    uiState.setTooltipMenuProvider(null);
  }

  getTooltipComponent(): React.FC<unknown> {
    return GameShipTooltipMenu as React.FC<unknown>;
  }
}

export default GameShipTooltipMenuStrategy;
