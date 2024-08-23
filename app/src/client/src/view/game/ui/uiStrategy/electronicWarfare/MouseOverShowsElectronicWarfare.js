import UiStrategy from "../UiStrategy";

class MouseOverShowsElectronicWarfare extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.getServices();
    electronicWarfareIndicatorService.hideAll();
  }

  mouseOverShip(payload) {
    const { electronicWarfareIndicatorService } = this.getServices();
    electronicWarfareIndicatorService.hideAll();
    electronicWarfareIndicatorService.showForShip(payload.entity.ship);
  }

  mouseOutShip() {
    const { electronicWarfareIndicatorService } = this.getServices();
    electronicWarfareIndicatorService.hideAll();
  }
}

export default MouseOverShowsElectronicWarfare;
