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

  getSectionsThatCanBeHit(
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

  getHitSections(
    shooterPosition,
    shipPosition,
    shipFacing,
    ignoreSections = []
  ) {
    const sectionsWithoutIgnore = this.getSectionsThatCanBeHit(
      shooterPosition,
      shipPosition,
      shipFacing
    );

    if (ignoreSections.length === 0) {
      return sectionsWithoutIgnore;
    }

    const sectionsWithIgnore = this.getSectionsThatCanBeHit(
      shooterPosition,
      shipPosition,
      shipFacing,
      ignoreSections
    );

    return sectionsWithIgnore.filter(
      withIgnore =>
        !sectionsWithoutIgnore.find(
          withoutIgnore => withoutIgnore.location === withIgnore.location
        )
    );
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
