import {
  PrimarySection,
  FrontSection,
  AftSection,
  PortFrontSection,
  PortAftSection,
  StarboardFrontSection,
  StarboardAftSection
} from "./systemSection/index.mjs";
import { getCompassHeadingOfPoint, addToDirection } from "../../utils/math.mjs";

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

  getNextSectionForHit(heading, lastSection) {
    return this.sections.find(section => {
      const location = section.getOffsetHex();
      const intervening = location.getNeighbourAtHeading(heading);

      return lastSection.getOffsetHex().equals(intervening);
    });
  }

  getSectionsThatCanBeHit(heading) {
    return this.sections.filter(section => {
      const location = section.getOffsetHex();
      const intervening = location.getNeighbourAtHeading(heading);

      return this.sections.every(blockingSection => {
        if (!blockingSection.getOffsetHex().equals(intervening)) {
          return true;
        } else if (!blockingSection.hasUndestroyedStructure()) {
          return true;
        } else if (blockingSection === section) {
          return true;
        } else {
          return false;
        }
      });
    });
  }

  getHitSections(shooterPosition, shipPosition, shipFacing, lastSection) {
    const heading = this.getHitSectionHeading(
      shooterPosition,
      shipPosition,
      shipFacing
    );

    if (!lastSection) {
      return this.getSectionsThatCanBeHit(heading);
    }

    let result = [];

    while (true) {
      const newSection = this.getNextSectionForHit(heading, lastSection);

      if (!newSection) {
        return result;
      }

      result = result.concat(newSection);

      if (newSection.hasUndestroyedStructure()) {
        return result;
      }

      lastSection = newSection;
    }
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

  getSectionBySystem(system) {
    return this.sections.find(section =>
      section.systems.find(otherSystem => system.id === otherSystem.id)
    );
  }
}

export default ShipSystemSections;
