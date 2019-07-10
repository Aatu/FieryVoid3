import {
  PrimarySection,
  FrontSection,
  AftSection,
  PortFrontSection,
  PortAftSection,
  StarboardFrontSection,
  StarboardAftSection
} from "./systemSection";
import { getCompassHeadingOfPoint, addToDirection } from "../../utils/math.mjs";
import hexagon from "../../hexagon";

class ShipSystemSections {
  constructor() {
    this.sections = [
      new PrimarySection(),
      new FrontSection(),
      new AftSection(),
      new PortFrontSection(),
      new PortAftSection(),
      new StarboardFrontSection(),
      new StarboardAftSection()
    ];
  }

  getHitSectionHeading(shooterPosition, shipPosition, shipFacing) {
    const heading = addToDirection(
      getCompassHeadingOfPoint(shipPosition, shooterPosition),
      -shipFacing
    );

    return heading;
  }

  getHitSection(
    shooterPosition,
    shipPosition,
    shipFacing,
    ignoreSections = []
  ) {
    const heading = this.getHitSectionHeading(
      shooterPosition,
      shipPosition,
      shipFacing
    );

    return this.sections.filter(section => {
      const location = section.getOffsetHex();
      const intervening = location.getNeighbourAtHeading(heading);

      if (ignoreSections.includes(section)) {
        return false;
      }

      return this.sections.every(blockingSection => {
        if (!blockingSection.getOffsetHex().equals(intervening)) {
          return true;
        } else if (!blockingSection.hasUndestroyedStructure()) {
          return true;
        } else if (blockingSection === section) {
          return true;
        } else if (ignoreSections.includes(blockingSection)) {
          return true;
        } else {
          return false;
        }
      });
    });
  }

  getPrimarySection() {
    return this.getSection(PrimarySection);
  }

  getFrontSection() {
    return this.getSection(FrontSection);
  }

  getAftSection() {
    return this.getSection(AftSection);
  }

  getStarboardFrontSection() {
    return this.getSection(StarboardFrontSection);
  }

  getStarboardAftSection() {
    return this.getSection(StarboardAftSection);
  }

  getPortFrontSection() {
    return this.getSection(PortFrontSection);
  }

  getPortAftSection() {
    return this.getSection(PortAftSection);
  }

  getSection(location) {
    return this.sections.find(section => section instanceof location);
  }
}

export default ShipSystemSections;
