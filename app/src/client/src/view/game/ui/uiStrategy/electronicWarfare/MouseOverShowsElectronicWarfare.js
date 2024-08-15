import UiStrategy from "../UiStrategy";

class MouseOverShowsElectronicWarfare extends UiStrategy {
  deactivate() {
    const { electronicWarfareIndicatorService } = this.services;
    electronicWarfareIndicatorService.hideAll();
  }

  mouseOverShip(payload) {
    const { electronicWarfareIndicatorService } = this.services;
    electronicWarfareIndicatorService.hideAll();
    electronicWarfareIndicatorService.showForShip(payload.entity.ship);
  }

  mouseOutShip() {
    const { electronicWarfareIndicatorService } = this.services;
    electronicWarfareIndicatorService.hideAll();
  }
}

export default MouseOverShowsElectronicWarfare;
