import Animation from "./Animation";

class ShipDamageAnimation extends Animation {
  constructor(icon, sections, start = 0, end = null) {
    super();
    this.icon = icon;
    this.sections = sections;
    this.start = start;
    this.end = end;

    this.active = false;
  }

  render({ total }) {
    if (this.end && total >= this.end && !this.active) {
      return;
    }

    if (this.end && total >= this.end && this.active) {
      this.deactivate();
      return;
    }

    if (this.active && total < this.start) {
      this.deactivate();
      return;
    }

    if (!this.active && total >= this.start) {
      this.activate();
    }
  }

  async activate() {
    this.active = true;
    await this.icon.isShipObjectLoaded;
    if (this.sections) {
      this.icon.shipObjectSectionDamageEffect.createDamageForSections(
        this.sections
      );
    } else {
      this.icon.shipObjectSectionDamageEffect.createDamage();
    }
  }

  async deactivate() {
    this.active = false;
    await this.icon.isShipObjectLoaded;
    this.icon.shipObjectSectionDamageEffect.removeDamage();
  }
}

export default ShipDamageAnimation;
