import {
  PrimarySection,
  FrontSection,
  AftSection,
  PortFrontSection,
  PortAftSection,
  StarboardFrontSection,
  StarboardAftSection,
} from "./systemSection/index";
import { getCompassHeadingOfPoint, addToDirection } from "../../utils/math";
import SystemSection from "./systemSection/SystemSection";
import Ship from "../Ship";
import { IVector } from "../../utils/Vector";
import { SYSTEM_LOCATION } from "./systemSection/systemLocation";
import ShipSystem from "./ShipSystem";

class ShipSystemSections {
  private ship: Ship;
  public sections: SystemSection[];

  constructor(ship: Ship) {
    this.ship = ship;

    this.sections = [
      new PrimarySection(),
      new FrontSection(),
      new AftSection(),
      new PortFrontSection(),
      new PortAftSection(),
      new StarboardFrontSection(),
      new StarboardAftSection(),
    ];
  }

  getHitSectionHeading(
    shooterPosition: IVector,
    shipPosition: IVector,
    shipFacing: number
  ) {
    const heading = addToDirection(
      getCompassHeadingOfPoint(shipPosition, shooterPosition),
      -shipFacing
    );

    if (this.ship.movement.isRolled()) {
      return addToDirection(0, -heading);
    }

    return heading;
  }

  getNextSectionForHit(heading: number, lastSection: SystemSection) {
    return this.sections.find((section) => {
      const location = section.getOffsetHex();
      const intervening = location.getNeighbourAtHeading(heading);

      return lastSection.getOffsetHex().equals(intervening);
    });
  }

  getSectionsThatCanBeHit(heading: number) {
    return this.sections.filter((section) => {
      const location = section.getOffsetHex();
      const intervening = location.getNeighbourAtHeading(heading);

      return this.sections.every((blockingSection) => {
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

  getHitSections(
    shooterPosition: IVector,
    shipPosition: IVector,
    shipFacing: number,
    lastSection: SystemSection | null = null
  ) {
    const heading = this.getHitSectionHeading(
      shooterPosition,
      shipPosition,
      shipFacing
    );

    if (!lastSection) {
      return this.getSectionsThatCanBeHit(heading);
    }

    let result: SystemSection[] = [];

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

  hasSectionWithStructure(type: typeof SystemSection) {
    return this.getSection(type)?.getStructure();
  }

  hasFrontSectionWithStructure() {
    return this.hasSectionWithStructure(FrontSection);
  }

  hasStarboardFrontSectionWithStructure() {
    return this.hasSectionWithStructure(StarboardFrontSection);
  }

  hasStarboardAftSectionWithStructure() {
    return this.hasSectionWithStructure(StarboardAftSection);
  }

  hasPortFrontSectionWithStructure() {
    return this.hasSectionWithStructure(PortFrontSection);
  }

  hasPortAftSectionWithStructure() {
    return this.hasSectionWithStructure(PortAftSection);
  }

  hasAftSectionWithStructure() {
    return this.hasSectionWithStructure(AftSection);
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

  getSection(location: typeof SystemSection) {
    return this.sections.find((section) => section instanceof location);
  }

  getSectionBySystem(system: ShipSystem): SystemSection {
    const section = this.sections.find((section) =>
      section.getSystems().find((otherSystem) => system.id === otherSystem.id)
    );

    if (!section) {
      throw new Error("Every system must be in a section");
    }

    return section;
  }

  getSectionsWithStructure() {
    return this.sections.filter((section) => section.getStructure());
  }
}

export default ShipSystemSections;
