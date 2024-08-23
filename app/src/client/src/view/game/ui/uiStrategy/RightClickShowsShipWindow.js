import UiStrategy from "./UiStrategy";

class RightClickShowsShipWindow extends UiStrategy {
  shipRightClicked(payload) {
    const { uiState } = this.getServices();
    //TODO: open tooltip in ship window mode?
  }
}

export default RightClickShowsShipWindow;
