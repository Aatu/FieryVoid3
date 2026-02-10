import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";
import ShipObject from "../renderer/ships/ShipObject";
import Animation from "./Animation";
import SystemSection from "@fieryvoid3/model/src/unit/system/systemSection/SystemSection";

class ShipDamageAnimation extends Animation {
  private icon: ShipObject;
  private sections: SystemSection[];
  private startTime: number;
  private end: number | null = 0;

  constructor(
    icon: ShipObject,
    sections: SystemSection[],
    start: number = 0,
    end: number | null = null
  ) {
    super();
    this.icon = icon;
    this.sections = sections;
    this.startTime = start;
    this.end = end;

    this.active = false;
  }

  render({ total }: RenderPayload) {
    if (this.end && total >= this.end && !this.active) {
      return;
    }

    if (this.end && total >= this.end && this.active) {
      this.deactivate();
      return;
    }

    if (this.active && total < this.startTime) {
      this.deactivate();
      return;
    }

    if (!this.active && total >= this.startTime) {
      this.activate();
    }
  }

  async activate() {
    this.active = true;
    await this.icon.isLoaded.promise;
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
    await this.icon.isLoaded.promise;
    this.icon.shipObjectSectionDamageEffect.removeDamage();
  }

  update(): void {}
}

export default ShipDamageAnimation;
