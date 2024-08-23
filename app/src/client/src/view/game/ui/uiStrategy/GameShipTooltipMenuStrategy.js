import UiStrategy from "./UiStrategy";
import GameShipTooltipMenu from "../shipTooltip/GameShipTooltipMenu";

class GameShipTooltipMenuStrategy extends UiStrategy {
  activate(services) {
    super.activate(services);
    const { uiState } = this.getServices();

    uiState.setTooltipMenuProvider(this.getTooltipComponent);
  }

  deactivate() {
    super.deactivate();
    const { uiState } = this.getServices();

    uiState.setTooltipMenuProvider(null);
  }

  getTooltipComponent() {
    return GameShipTooltipMenu;
  }
}

export default GameShipTooltipMenuStrategy;
